import { useState } from 'react';
import { ArrowLeftRight, Copy, Check, Trash2, Info, Languages } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { Languages as TransIcon } from 'lucide-react';

const LANG_OPTIONS = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
];

export function TranslateView({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [from, setFrom] = useState('ar');
  const [to, setTo] = useState('en');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setText(result);
    setResult(text);
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard?.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const clear = () => {
    setText('');
    setResult('');
  };

  return (
    <div className="animate-fade-in">
      <SectionHeader title={t('secTranslate')} subtitle={t('secTranslateDesc')} icon={TransIcon} onBack={onBack} />

      {/* Language selectors */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex-1">
          <label className="label">{t('from')}</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="input-field">
            {LANG_OPTIONS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
        <button
          onClick={swap}
          className="mt-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-electric-400 transition-all hover:border-electric-500/40 hover:bg-electric-500/10"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <label className="label">{t('to')}</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="input-field">
            {LANG_OPTIONS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      </div>

      {/* Input */}
      <div className="card-surface mb-3 p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('translatePlaceholder')}
          className="min-h-[120px] w-full resize-none bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          dir={from === 'ar' ? 'rtl' : 'ltr'}
        />
        <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2">
          <span className="text-[11px] text-slate-500">{text.length} / 5000</span>
          <div className="flex gap-2">
            {text && (
              <button onClick={clear} className="btn-ghost !py-1.5 !text-xs">
                <Trash2 className="h-3.5 w-3.5" /> {t('clear')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="card-surface mb-3 border-electric-500/20 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-electric-400">{t('translateResult')}</span>
          {result && (
            <button onClick={copy} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white">
              {copied ? <Check className="h-3.5 w-3.5 text-success-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t('copied') : t('copy')}
            </button>
          )}
        </div>
        <p className="min-h-[80px] text-sm text-slate-200" dir={to === 'ar' ? 'rtl' : 'ltr'}>
          {result || <span className="text-slate-600">{t('translateResult')}...</span>}
        </p>
      </div>

      <button
        onClick={() => setResult('')}
        disabled={!text.trim()}
        className="btn-glow w-full"
      >
        <Languages className="h-4 w-4" />
        {t('translate')}
      </button>

      <div className="mt-4 flex items-start gap-2 rounded-2xl border border-aura-500/20 bg-aura-500/5 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-aura-400" />
        <p className="text-xs text-slate-400">{t('translateComingSoon')}</p>
      </div>
    </div>
  );
}
