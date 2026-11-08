import { useI18n } from '../i18n/I18nContext';
import { SECTION_META, SECTION_ORDER, SMART_TOOL_SECTIONS } from '../lib/sections';
import type { ViewId } from '../types';
import { Sparkles, Mic, ArrowUpRight, BookOpen } from 'lucide-react';

interface HomeProps {
  onNavigate: (v: ViewId) => void;
}

const SECTION_TITLE_MAP: Record<string, string> = {
  chat: 'secChat', voice: 'secVoice', tasks: 'secTasks', calendar: 'secCalendar',
  finance: 'secFinance', business: 'secBusiness', invoices: 'secInvoices',
  translate: 'secTranslate', studio: 'secStudio', audio: 'secAudio', files: 'secFiles',
  knowledge: 'secKnowledge', discount: 'secDiscount', videostudio: 'secVideostudio',
  marketing: 'secMarketing', brand: 'secBrand',
  settings: 'secSettings',
};

const SECTION_DESC_MAP: Record<string, string> = {
  chat: 'secChatDesc', voice: 'secVoiceDesc', tasks: 'secTasksDesc', calendar: 'secCalendarDesc',
  finance: 'secFinanceDesc', business: 'secBusinessDesc', invoices: 'secInvoicesDesc',
  translate: 'secTranslateDesc', studio: 'secStudioDesc', audio: 'secAudioDesc', files: 'secFilesDesc',
  knowledge: 'secKnowledgeDesc', discount: 'secDiscountDesc', videostudio: 'secVideostudioDesc',
  marketing: 'secMarketingDesc', brand: 'secBrandDesc',
  settings: 'secSettingsDesc',
};

export function Home({ onNavigate }: HomeProps) {
  const { t, lang } = useI18n();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('greetingMorning') : hour < 18 ? t('greetingAfternoon') : t('greetingEvening');

  const quickActions: { id: Exclude<ViewId, 'home'>; label: string }[] = [
    { id: 'chat', label: t('secChat') },
    { id: 'voice', label: t('secVoice') },
    { id: 'knowledge', label: t('secKnowledge') },
  ];

  const coreSections = SECTION_ORDER.filter((id) => !SMART_TOOL_SECTIONS.includes(id) && id !== 'voice');

  const renderSectionCard = (id: Exclude<ViewId, 'home'>, idx: number) => {
    const meta = SECTION_META[id];
    const Icon = meta.icon;
    return (
      <button
        key={id}
        onClick={() => onNavigate(id)}
        style={{ animationDelay: `${idx * 40}ms` }}
        className={`group relative animate-slide-up overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b ${meta.gradient} p-4 text-start transition-all hover:border-electric-500/30 hover:shadow-glow-sm`}
      >
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-ink-950/40 text-electric-400 transition-transform group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold leading-tight text-white">{t(SECTION_TITLE_MAP[id])}</p>
        <p className="mt-0.5 text-[11px] leading-tight text-slate-400 line-clamp-2">{t(SECTION_DESC_MAP[id])}</p>
      </button>
    );
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-ink-800 via-ink-850 to-ink-900 p-6">
        <div className="absolute inset-0 bg-radial-glow opacity-60" />
        <div className="absolute inset-0 bg-radial-aura opacity-50" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span className="chip border-electric-500/30 bg-electric-500/10 text-electric-300">
              <Sparkles className="h-3 w-3" />
              {t('aiIntegrationReady')}
            </span>
          </div>
          <p className="text-sm text-slate-400">{greeting}</p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            {t('appName')}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{t('tagline')}</p>

          {/* Quick actions */}
          <div className="mt-5 flex gap-2">
            {quickActions.map((qa) => {
              const meta = SECTION_META[qa.id];
              return (
                <button
                  key={qa.id}
                  onClick={() => onNavigate(qa.id)}
                  className="group flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-slate-300 transition-all hover:border-electric-500/40 hover:bg-electric-500/10 hover:text-white"
                >
                  <meta.icon className="h-4 w-4 text-electric-400" />
                  <span className="truncate">{qa.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Voice assistant highlight */}
      <button
        onClick={() => onNavigate('voice')}
        className="group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-aura-500/20 bg-gradient-to-r from-aura-500/10 via-ink-850 to-electric-500/10 p-5 text-start transition-all hover:border-aura-500/40"
      >
        <div className="absolute inset-0 bg-radial-aura opacity-30" />
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-aura-500/15 text-aura-400 shadow-glow-aura">
          <Mic className="h-7 w-7" />
        </div>
        <div className="relative flex-1">
          <p className="text-sm font-semibold text-white">{t('secVoice')}</p>
          <p className="text-xs text-slate-400">{t('secVoiceDesc')}</p>
        </div>
        <ArrowUpRight className="relative h-5 w-5 text-slate-500 transition-colors group-hover:text-aura-300" style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }} />
      </button>

      {/* All sections grid */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title">{t('allSections')}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {coreSections.map((id, idx) => renderSectionCard(id, idx))}
        </div>
      </div>

      {/* Smart Tools section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-aura-500/15 text-aura-400">
            <BookOpen className="h-3.5 w-3.5" />
          </div>
          <h2 className="section-title">{t('smartTools')}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SMART_TOOL_SECTIONS.map((id, idx) => renderSectionCard(id, idx))}
        </div>
      </div>
    </div>
  );
}
