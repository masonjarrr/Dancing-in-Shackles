import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Dancing in Shackles',
  description: 'Productivity with accountability and wellbeing balance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} antialiased`}>
        <div className="min-h-screen">
          <Sidebar />
          <Header />
          <main className="md:pl-64">
            <div className="max-w-6xl mx-auto p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
