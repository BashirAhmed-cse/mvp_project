// app/layout.tsx
'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LoginPage from "@/components/LoginPage";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Since we can't use metadata in client components, we'll export it separately
// export const metadata = {
//   title: 'FundGuard - Financial Management',
//   description: 'Secure financial management platform',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}

// Create a separate client component for authentication logic
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const authStatus = localStorage.getItem('isAuthenticated');
      const isAuth = authStatus === 'true';
      setIsAuthenticated(isAuth);
      setIsLoading(false);

      // Redirect to login if not authenticated and not on login page
      if (!isAuth && pathname !== '/login') {
        router.push('/login');
      }
      
      // Redirect to dashboard if authenticated and on login page
      if (isAuth && pathname === '/login') {
        router.push('/dashboard');
      }
    };

    checkAuth();

    // Listen for storage changes (for logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAuthenticated') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router, pathname]);

  if (isLoading) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {isAuthenticated ? (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            
            {/* Page content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-background text-foreground border-border',
              style: {
                borderWidth: '1px',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
        </div>
      ) : (
        // Show login page when not authenticated
        <LoginPage />
      )}
    </ThemeProvider>
  );
}