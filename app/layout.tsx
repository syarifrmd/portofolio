import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileNotification from "./components/MobileNotification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Syarif Romadloni - Web Developer",
  description: "Portfolio website of Syarif Romadloni, a web developer specializing in modern web technologies, UI/UX design, and creative media.",
  keywords: ["Web Developer", "Next.js", "React", "Portfolio", "Syarif Romadloni", "UI/UX", "Figma"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MobileNotification />
        {children}
      </body>
    </html>
  );
}
