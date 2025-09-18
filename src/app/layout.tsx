// app/layout.tsx
'use client';
import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LoginPage from "@/components/LoginPage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    setIsLoading(false);

    if (authStatus) {
      // If already logged in and visiting /login or root, redirect to dashboard
      if (pathname === "/login" || pathname === "/") {
        router.replace("/dashboard");
      }
    } else {
      // If not logged in and visiting anything except /login, redirect to login
      if (pathname !== "/login") {
        router.replace("/login");
      }
    }
  }, [pathname, router]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isAuthenticated") {
        const authStatus = localStorage.getItem("isAuthenticated") === "true";
        setIsAuthenticated(authStatus);
        if (!authStatus) {
          router.replace("/login");
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  if (isLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {isAuthenticated ? (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
        <LoginPage />
      )}
    </ThemeProvider>
  );
}


