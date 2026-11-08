import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const { t } = useI18n();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible || !deferred) return null;

  const handleInstall = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-sm animate-slide-up rounded-2xl border border-electric-500/30 bg-ink-850/95 p-4 backdrop-blur-xl shadow-glow sm:left-auto sm:right-6">
      <button
        onClick={() => setVisible(false)}
        className="absolute -top-2 -right-2 rounded-full border border-white/10 bg-ink-800 p-1 text-slate-400 hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric-500/15 text-electric-400">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{t('installApp')} — Smart Me</p>
          <p className="text-xs text-slate-400">{t('installHint')}</p>
        </div>
      </div>
      <button onClick={handleInstall} className="btn-glow mt-3 w-full text-xs">
        {t('installApp')}
      </button>
    </div>
  );
}
