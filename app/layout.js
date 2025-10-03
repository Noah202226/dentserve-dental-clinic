"use client";

import "./globals.css";
import { useInitTheme } from "./components/layout/ThemeProvider";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/authStore";

export default function RootLayout({ children }) {
  useInitTheme();
  const { current } = useAuthStore((state) => state);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-base-100 text-base-content transition-colors duration-300">
        {/* ✅ Show header + footer only if no user */}
        {!current && <Header />}
        <main className="min-h-screen">{children}</main>
        {!current && <Footer />}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "8px",
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}
