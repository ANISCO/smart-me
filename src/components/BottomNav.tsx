import { Home, MessageSquare, CheckSquare, Wallet, LayoutGrid, Settings } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import type { ViewId } from '../types';

interface BottomNavProps {
  view: ViewId;
  onNavigate: (v: ViewId) => void;
}

export function BottomNav({ view, onNavigate }: BottomNavProps) {
  const { t } = useI18n();

  const items: { id: ViewId; icon: typeof Home; label: string }[] = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'chat', icon: MessageSquare, label: t('navChat') },
    { id: 'tasks', icon: CheckSquare, label: t('navTasks') },
    { id: 'finance', icon: Wallet, label: t('navFinance') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 safe-bottom border-t border-white/5 bg-ink-950/85 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {items.map(({ id, icon: Icon, label }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="group relative flex flex-1 flex-col items-center gap-0.5 py-2.5"
            >
              {active && (
                <span className="absolute -top-px h-0.5 w-8 rounded-full bg-electric-400 shadow-glow-sm" />
              )}
              <Icon
                className={`h-5 w-5 transition-colors ${
                  active ? 'text-electric-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? 'text-electric-300' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => onNavigate('home')}
          className="group relative flex flex-1 flex-col items-center gap-0.5 py-2.5"
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
              view !== 'home' && !items.some((i) => i.id === view) && view !== 'settings'
                ? 'border-electric-500/40 bg-electric-500/10 text-electric-300'
                : 'border-white/10 text-slate-500 group-hover:text-slate-300'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </span>
          <span
            className={`text-[10px] font-medium ${
              view !== 'home' && !items.some((i) => i.id === view) && view !== 'settings'
                ? 'text-electric-300'
                : 'text-slate-500 group-hover:text-slate-300'
            }`}
          >
            {t('allSections')}
          </span>
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className="group relative flex flex-1 flex-col items-center gap-0.5 py-2.5"
        >
          {view === 'settings' && (
            <span className="absolute -top-px h-0.5 w-8 rounded-full bg-electric-400 shadow-glow-sm" />
          )}
          <Settings
            className={`h-5 w-5 transition-colors ${
              view === 'settings' ? 'text-electric-400' : 'text-slate-500 group-hover:text-slate-300'
            }`}
            strokeWidth={view === 'settings' ? 2.4 : 2}
          />
          <span
            className={`text-[10px] font-medium transition-colors ${
              view === 'settings' ? 'text-electric-300' : 'text-slate-500 group-hover:text-slate-300'
            }`}
          >
            {t('settings')}
          </span>
        </button>
      </div>
    </nav>
  );
}
