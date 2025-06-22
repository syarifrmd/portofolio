"use client";

import { useState, useEffect } from 'react';
import { X, MonitorSmartphone } from 'lucide-react';

const MobileNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Cek apakah notifikasi sudah pernah ditutup sebelumnya
    const notificationDismissed = localStorage.getItem('mobileNotificationDismissed');
    
    // Cek ukuran layar
    const checkDevice = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Tampilkan notifikasi jika ini perangkat mobile DAN belum pernah ditutup
      if (mobile && !notificationDismissed) {
        setIsVisible(true);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  const handleDismiss = () => {
    // Sembunyikan notifikasi dan simpan statusnya di localStorage
    setIsVisible(false);
    localStorage.setItem('mobileNotificationDismissed', 'true');
  };

  if (!isVisible || !isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md p-4 bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl z-50 animate-bounce-slow">
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <MonitorSmartphone className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-white">Desktop View Recommended</h4>
          <p className="text-sm text-neutral-300 mt-1">
            For the best experience, we recommend enabling "Desktop site" mode in your browser settings.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full text-neutral-400 hover:bg-slate-700/50 hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MobileNotification; 