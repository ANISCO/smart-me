import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  onBack: () => void;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, icon: Icon, onBack, action }: SectionHeaderProps) {
  const { dir } = useI18n();
  const BackIcon = dir === 'rtl' ? ArrowLeft : ArrowLeft;

  return (
    <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-white/5 bg-ink-950/80 px-4 py-3 backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-electric-500/40 hover:text-white"
        >
          <BackIcon className="h-5 w-5 rtl:rotate-0" style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : 'none' }} />
        </button>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric-500/10 text-electric-400">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-white">{title}</h2>
          {subtitle && <p className="truncate text-xs text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
