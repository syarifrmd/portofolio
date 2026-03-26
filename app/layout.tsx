import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileNotification from "./components/MobileNotification";
import LanguageSwitcher from "./components/LanguageSwitcher";
import Script from "next/script";

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
        {/* Hidden Google Translate Element */}
        <div id="google_translate_element" className="hidden"></div>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="lazyOnload"
        />
        <Script id="google-translate-config" strategy="lazyOnload">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'auto',
                includedLanguages: 'en,id', // Hanya tampilkan inggris & indonesia
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>

        <MobileNotification />
        <LanguageSwitcher />
        {children}
      </body>
    </html>
  );
}
