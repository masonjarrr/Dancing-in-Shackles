'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AccountabilityReview } from '@/types/database';

interface ReviewHistoryProps {
  reviews: AccountabilityReview[];
}

export function ReviewHistory({ reviews }: ReviewHistoryProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No reviews yet. Complete your first weekly review above.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Past Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review, i) => (
          <div key={review.id}>
            {i > 0 && <Separator className="mb-4" />}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">
                  {new Date(review.review_date).toLocaleDateString()}
                </p>
                <div className="flex gap-3 text-xs">
                  <span>Performance: {review.performance_score}/10</span>
                  <span>Wellbeing: {review.wellbeing_score}/10</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Kept {review.commitments_kept} of {review.commitments_total} commitments
              </p>
              {review.reflection && (
                <p className="text-sm">{review.reflection}</p>
              )}
              {review.recovery_needed && (
                <span className="text-xs text-yellow-400">Recovery requested</span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
