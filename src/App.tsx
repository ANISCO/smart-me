import { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { BottomNav } from './components/BottomNav';
import { Home } from './components/Home';
import { InstallPrompt } from './components/InstallPrompt';
import type { ViewId } from './types';

import { ChatView } from './views/ChatView';
import { VoiceView } from './views/VoiceView';
import { TasksView } from './views/TasksView';
import { CalendarView } from './views/CalendarView';
import { FinanceView } from './views/FinanceView';
import { BusinessView } from './views/BusinessView';
import { InvoicesView } from './views/InvoicesView';
import { TranslateView } from './views/TranslateView';
import { StudioView } from './views/StudioView';
import { AudioView } from './views/AudioView';
import { FilesView } from './views/FilesView';
import { KnowledgeView } from './views/KnowledgeView';
import { DiscountView } from './views/DiscountView';
import { VideoStudioView } from './views/VideoStudioView';
import { MarketingView } from './views/MarketingView';
import { BrandView } from './views/BrandView';
import { SettingsView } from './views/SettingsView';

function AppInner() {
  const { t } = useI18n();
  const [view, setView] = useState<ViewId>('home');

  const navigate = (v: ViewId) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  const renderView = () => {
    switch (view) {
      case 'home': return <Home onNavigate={navigate} />;
      case 'chat': return <ChatView onBack={() => navigate('home')} />;
      case 'voice': return <VoiceView onBack={() => navigate('home')} />;
      case 'tasks': return <TasksView onBack={() => navigate('home')} />;
      case 'calendar': return <CalendarView onBack={() => navigate('home')} />;
      case 'finance': return <FinanceView onBack={() => navigate('home')} />;
      case 'business': return <BusinessView onBack={() => navigate('home')} />;
      case 'invoices': return <InvoicesView onBack={() => navigate('home')} />;
      case 'translate': return <TranslateView onBack={() => navigate('home')} />;
      case 'studio': return <StudioView onBack={() => navigate('home')} />;
      case 'audio': return <AudioView onBack={() => navigate('home')} />;
      case 'files': return <FilesView onBack={() => navigate('home')} />;
      case 'knowledge': return <KnowledgeView onBack={() => navigate('home')} />;
      case 'discount': return <DiscountView onBack={() => navigate('home')} />;
      case 'videostudio': return <VideoStudioView onBack={() => navigate('home')} />;
      case 'marketing': return <MarketingView onBack={() => navigate('home')} />;
      case 'brand': return <BrandView onBack={() => navigate('home')} />;
      case 'settings': return <SettingsView onBack={() => navigate('home')} />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-ink-950 text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-grid-navy opacity-[0.15]" style={{ backgroundSize: '40px 40px' }} />
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-electric-500/10 blur-[120px]" />
        <div className="absolute top-1/3 right-0 h-72 w-72 rounded-full bg-aura-500/8 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="safe-top sticky top-0 z-30 border-b border-white/5 bg-ink-950/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <button onClick={() => navigate('home')} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-electric-600 to-aura-500 text-sm font-bold text-white shadow-glow-sm">S</div>
            <div className="text-start">
              <p className="text-sm font-bold leading-none text-white">{t('appName')}</p>
              <p className="mt-0.5 text-[10px] leading-none text-slate-500">{t('tagline')}</p>
            </div>
          </button>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-md px-4 pb-28 pt-4">
        {renderView()}
      </main>

      {/* Bottom navigation */}
      <BottomNav view={view} onNavigate={navigate} />

      {/* Install prompt */}
      <InstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}
