"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<"en" | "id">("en");

  useEffect(() => {
    // Detect current language from Google Translate cookie
    const hasIdCookie = document.cookie.includes("googtrans=/en/id") || document.cookie.includes("googtrans=/auto/id");
    if (hasIdCookie) {
      setLang("id");
    } else {
      setLang("en");
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "id" : "en";
    setLang(newLang);
    
    // Hapus cookie Google Translate yang lama agar clear
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    if (window.location.hostname !== "localhost") {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    }

    // Paksa set cookie Google Translate ('/auto/en' atau '/auto/id')
    document.cookie = `googtrans=/auto/${newLang}; path=/;`;
    if (window.location.hostname !== "localhost") {
      document.cookie = `googtrans=/auto/${newLang}; path=/; domain=${window.location.hostname};`;
      document.cookie = `googtrans=/auto/${newLang}; path=/; domain=.${window.location.hostname};`;
    }
    
    // Refresh page to apply Google Translate script parsing
    window.location.reload();
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-6 md:right-6 notranslate">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-3.5 py-2 md:px-4 md:py-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl text-cyan-50 font-medium text-sm md:text-base border-b-cyan-500/30 transition-all hover:bg-slate-800 hover:border-cyan-400 hover:shadow-cyan-500/20"
      >
        <Globe className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
        {lang === "en" ? "EN" : "ID"}
      </motion.button>
    </div>
  );
}