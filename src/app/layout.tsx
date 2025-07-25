import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from 'sonner';
import { Inter, Source_Code_Pro } from 'next/font/google';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/lib/auth-context';
import { CurriculumWrapper } from '@/components/CurriculumWrapper';
import { CurriculumProvider } from '@/components/CurriculumContext';
import { FirebaseErrorBoundary } from '@/components/FirebaseErrorBoundary';
import { IndexedDBErrorHandler } from '@/components/IndexedDBErrorHandler';

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const fontCode = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-code',
});

export const metadata: Metadata = {
  title: 'EdTech AI Hub',
  description: 'An AI-powered educational platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", fontBody.variable, fontCode.variable)}>
        <IndexedDBErrorHandler />
        <FirebaseErrorBoundary>
          <AuthProvider>
            <CurriculumProvider>
              <CurriculumWrapper>
                {children}
              </CurriculumWrapper>
            </CurriculumProvider>
            <Toaster />
            <SonnerToaster richColors position="top-right" />
          </AuthProvider>
        </FirebaseErrorBoundary>
      </body>
    </html>
  );
}
