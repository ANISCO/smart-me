import { useI18n } from '../i18n/I18nContext';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const { dir } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] text-slate-500">
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-300">{title}</p>
      {subtitle && <p className="mt-1 max-w-xs text-xs text-slate-500">{subtitle}</p>}
      <span className="sr-only" dir={dir} />
    </div>
  );
}
