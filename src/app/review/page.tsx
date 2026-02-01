'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ReviewForm } from '@/components/review/review-form';
import { ReviewHistory } from '@/components/review/review-history';
import type { AccountabilityReview, Task } from '@/types/database';

export default function ReviewPage() {
  const [reviews, setReviews] = useState<AccountabilityReview[]>([]);
  const [commitmentsKept, setCommitmentsKept] = useState(0);
  const [commitmentsTotal, setCommitmentsTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    // Get reviews
    const { data: reviewData } = await supabase
      .from('accountability_reviews')
      .select('*')
      .order('review_date', { ascending: false });
    setReviews(reviewData || []);

    // Calculate this week's commitments
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStr = weekAgo.toISOString().split('T')[0];

    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .gte('created_at', weekStr);

    const allTasks: Task[] = tasks || [];
    const completed = allTasks.filter((t) => t.status === 'completed').length;
    const total = allTasks.filter((t) => t.status !== 'abandoned').length;

    setCommitmentsKept(completed);
    setCommitmentsTotal(total);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSubmit(data: {
    performance_score: number;
    wellbeing_score: number;
    reflection: string;
    improvement: string;
    recovery_needed: boolean;
  }) {
    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: newReview } = await supabase
        .from('accountability_reviews')
        .insert({
          review_date: today,
          performance_score: data.performance_score,
          wellbeing_score: data.wellbeing_score,
          commitments_kept: commitmentsKept,
          commitments_total: commitmentsTotal,
          reflection: data.reflection || null,
          improvement: data.improvement || null,
          recovery_needed: data.recovery_needed,
        })
        .select()
        .single();

      if (newReview) {
        setReviews((prev) => [newReview, ...prev]);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">Weekly Review</h2>

      <ReviewForm
        commitmentsKept={commitmentsKept}
        commitmentsTotal={commitmentsTotal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <ReviewHistory reviews={reviews} />
    </div>
  );
}
