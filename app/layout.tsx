import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider"; // <--- Import this
import Navbar from "./components/Navbar";
import { LanguageProvider } from "./context/LanguageContext";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UNICEF Club MNUMS",
  description: "Small Actions, Big Differences",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning> {/* Add suppressHydrationWarning */}
        <body className={inter.className}>
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              forcedTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <Navbar />
              {children}
              <Footer/>
            </ThemeProvider>
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}