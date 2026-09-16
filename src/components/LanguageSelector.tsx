'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { languages, Language, detectLanguage, setLanguage } from '@/lib/i18n';

interface Props {
  onLanguageChange?: (lang: Language) => void;
}

export default function LanguageSelector({ onLanguageChange }: Props) {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const detected = detectLanguage();
    setCurrentLang(detected);
    setLanguage(detected);
  }, []);

  const handleSelect = (lang: Language) => {
    setCurrentLang(lang);
    setLanguage(lang);
    setOpen(false);
    onLanguageChange?.(lang);
    // Reload to apply translations across app (simple approach)
    window.dispatchEvent(new CustomEvent('orbitdesk-language-change', { detail: lang }));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="h-8 px-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-[11px] font-medium flex items-center gap-1.5 transition"
        title="Change language"
      >
        <span>{languages[currentLang].flag}</span>
        <span className="hidden md:block">{languages[currentLang].nativeName}</span>
        <span className="text-[10px]">⌄</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="absolute right-0 top-10 z-20 w-[200px] rounded-2xl border border-zinc-800 bg-[#0a0a0a] shadow-2xl overflow-hidden"
            >
              <div className="p-3 border-b border-zinc-800">
                <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Language • Lugha • Idioma</p>
                <p className="text-[10px] text-zinc-600 mt-1">Major languages first • More coming</p>
              </div>

              <div className="p-2 space-y-1">
                {(Object.entries(languages) as [Language, typeof languages[Language]][]).map(([code, info]) => (
                  <button
                    key={code}
                    onClick={() => handleSelect(code)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border flex items-center justify-between transition ${
                      currentLang === code
                        ? 'bg-violet-500/10 border-violet-500/20 text-zinc-100'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[16px]">{info.flag}</span>
                      <div>
                        <p className="text-[12px] font-medium">{info.nativeName}</p>
                        <p className="text-[10px] opacity-70">{info.name}</p>
                      </div>
                    </div>
                    {currentLang === code && <span className="h-2 w-2 rounded-full bg-violet-500" />}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-zinc-900/30 border-t border-zinc-800 text-[10px] text-zinc-600 text-center">
                Auto-detects browser • Saved locally<br />
                <span className="text-zinc-500">Swahili for Kenya • UN major languages</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for using translations
export function useTranslation() {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const detected = detectLanguage();
    setLangState(detected);

    const handler = (e: any) => {
      setLangState(e.detail as Language);
    };
    window.addEventListener('orbitdesk-language-change', handler);
    return () => window.removeEventListener('orbitdesk-language-change', handler);
  }, []);

  const t = (key: string) => {
    const { getTranslation } = require('@/lib/i18n');
    return getTranslation(lang, key);
  };

  return { t, lang, setLang: setLanguage };
}
