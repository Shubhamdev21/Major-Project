import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "MAJOR_IOT | Industrial IoT Monitoring",
  description: "Advanced environment monitoring for major project evaluation",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground`} suppressHydrationWarning>
        {children}
        <Toaster theme="dark" position="top-right" closeButton duration={5000} />
      </body>
    </html>
  );
}
