import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Real-Time AI Data Intelligence Platform',
  description: 'Collaborative Multi-Agent Data Orchestrator for Structured & Unstructured Data',
  openGraph: {
    title: 'Real-Time AI Data Intelligence Platform',
    description: 'Collaborative Multi-Agent Data Orchestrator for Structured & Unstructured Data',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real-Time AI Data Intelligence Platform',
    description: 'Collaborative Multi-Agent Data Orchestrator for Structured & Unstructured Data',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-50 text-slate-900 antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full font-sans selection:bg-blue-100 selection:text-blue-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
