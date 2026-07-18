/**
 * Root Layout — GitaVerse Studio
 *
 * Sets up:
 * - Inter font (body) + Cormorant Garamond (headings / brand, via CSS)
 * - ThemeProvider for dark / light support (next-themes)
 * - TooltipProvider (required by shadcn/ui Tooltip)
 * - App shell: Sidebar + TopNavigation + main content area
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/layout/sidebar';
import { TopNavigation } from '@/components/layout/top-navigation';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GitaVerse Studio',
    template: '%s | GitaVerse Studio',
  },
  description:
    'Premium creative studio for translating the Bhagavad Gita wisdom into modern digital content.',
  keywords: ['Bhagavad Gita', 'GitaVerse', 'spiritual content', 'creative studio'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full`}
    >
      <body className="h-full font-sans antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {/*
             * App Shell — three-column structure:
             *   [Sidebar] | [Main: TopNav + Content]
             */}
            <div className="flex h-full">
              {/* Desktop Sidebar — hidden on mobile, handled by MobileSidebar Sheet */}
              <Sidebar />

              {/* Right column: top nav + scrollable content */}
              <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <TopNavigation />

                {/* Main scrollable content area */}
                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
