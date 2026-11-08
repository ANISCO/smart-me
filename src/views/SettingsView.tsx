import { useState } from 'react';
import { Settings as SettingsIcon, Cpu, Globe, Check, AlertCircle, Zap, CircleDollarSign, Info } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { loadJSON, saveJSON } from '../lib/storage';
import { PROVIDERS, PROVIDER_ORDER, sortedModels } from '../lib/providers';
import type { AIProvider, ProviderSettings } from '../types';

const KEY = 'smart-me-provider-settings';

const defaultSettings: ProviderSettings = {
  activeProvider: 'gemini',
  activeModel: 'gemini-2.0-flash',
  configured: { gemini: false, groq: false, openrouter: false },
};

export function SettingsView({ onBack }: { onBack: () => void }) {
  const { t, lang, setLang } = useI18n();
  const [settings, setSettings] = useState<ProviderSettings>(() => loadJSON(KEY, defaultSettings));
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<ProviderSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveJSON(KEY, next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const selectProvider = (id: AIProvider) => {
    const provider = PROVIDERS[id];
    const firstFree = sortedModels(provider).find((m) => m.free) ?? provider.models[0];
    update({ activeProvider: id, activeModel: firstFree.id });
  };

  const activeProvider = PROVIDERS[settings.activeProvider];
  const models = sortedModels(activeProvider);

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title={t('secSettings')}
        subtitle={t('secSettingsDesc')}
        icon={SettingsIcon}
        onBack={onBack}
        action={
          saved ? (
            <span className="flex items-center gap-1 text-xs text-success-400">
              <Check className="h-3.5 w-3.5" />
              {t('brandSaved')}
            </span>
          ) : undefined
        }
      />

      {/* General settings */}
      <div className="mb-5">
        <h3 className="section-title mb-3">{t('settingsGeneral')}</h3>
        <div className="card-surface p-4">
          <label className="label flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-electric-400" />
            {t('settingsLanguage')}
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {([
              { code: 'ar', label: 'العربية', flag: 'AR' },
              { code: 'tr', label: 'Türkçe', flag: 'TR' },
              { code: 'en', label: 'English', flag: 'EN' },
            ] as const).map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex flex-col items-center gap-1 rounded-xl border py-3 transition-all ${
                  lang === l.code
                    ? 'border-electric-500/50 bg-electric-500/10 text-electric-300'
                    : 'border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <span className="text-[10px] font-mono">{l.flag}</span>
                <span className="text-xs font-medium">{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Provider settings */}
      <div className="mb-5">
        <h3 className="section-title mb-1 flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-aura-400" />
          {t('settingsAiProviders')}
        </h3>
        <p className="mb-3 text-xs text-slate-500">{t('settingsAiProvidersDesc')}</p>

        {/* Provider selection cards */}
        <div className="space-y-2.5">
          {PROVIDER_ORDER.map((id) => {
            const provider = PROVIDERS[id];
            const isActive = settings.activeProvider === id;
            const isConfigured = settings.configured[id];
            return (
              <button
                key={id}
                onClick={() => selectProvider(id)}
                className={`group flex w-full items-center gap-3 rounded-2xl border p-3.5 text-start transition-all ${
                  isActive
                    ? 'border-electric-500/40 bg-electric-500/10'
                    : 'border-white/5 bg-white/[0.02] hover:border-white/15'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    isActive
                      ? 'border-electric-500/30 bg-electric-500/10 text-electric-400'
                      : 'border-white/10 bg-ink-950/40 text-slate-500'
                  }`}
                >
                  <Cpu className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{t(provider.label)}</p>
                    {isConfigured ? (
                      <span className="flex items-center gap-0.5 rounded-full bg-success-500/15 px-1.5 py-0.5 text-[9px] font-medium text-success-400">
                        <Check className="h-2.5 w-2.5" />
                        {t('settingsConfigured')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 rounded-full bg-warning-500/10 px-1.5 py-0.5 text-[9px] font-medium text-warning-400">
                        <AlertCircle className="h-2.5 w-2.5" />
                        {t('settingsNotConfigured')}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-slate-400">{t(provider.description)}</p>
                </div>
                {isActive && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-electric-500/20">
                    <Check className="h-3 w-3 text-electric-300" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Model selection for active provider */}
      <div className="mb-5">
        <label className="label mb-2 block">{t('settingsSelectModel')}</label>
        <div className="space-y-2">
          {models.map((model) => {
            const isActive = settings.activeModel === model.id;
            return (
              <button
                key={model.id}
                onClick={() => update({ activeModel: model.id })}
                className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-start transition-all ${
                  isActive
                    ? 'border-aura-500/40 bg-aura-500/10'
                    : 'border-white/5 bg-white/[0.02] hover:border-white/15'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{model.label}</p>
                  {model.contextWindow && (
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {t('settingsContextWindow')}: {model.contextWindow}
                    </p>
                  )}
                </div>
                <span
                  className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-medium ${
                    model.free
                      ? 'bg-success-500/15 text-success-400'
                      : 'bg-warning-500/10 text-warning-400'
                  }`}
                >
                  {model.free ? <Zap className="h-2.5 w-2.5" /> : <CircleDollarSign className="h-2.5 w-2.5" />}
                  {model.free ? t('settingsFree') : t('settingsPaid')}
                </span>
                {isActive && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-aura-500/20">
                    <Check className="h-3 w-3 text-aura-300" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* API key security note */}
      <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-electric-500/20 bg-electric-500/5 p-3.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
        <p className="text-xs leading-relaxed text-slate-400">{t('settingsApiKeyHint')}</p>
      </div>

      {/* Provider not configured notice */}
      {!settings.configured[settings.activeProvider] && (
        <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-warning-500/20 bg-warning-500/5 p-3.5">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning-400" />
          <div>
            <p className="text-xs leading-relaxed text-slate-300">{t('settingsProviderNotConfigured')}</p>
            <a
              href={activeProvider.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-block text-xs font-medium text-electric-400 hover:text-electric-300"
              dir="ltr"
            >
              {activeProvider.docsUrl}
            </a>
          </div>
        </div>
      )}

      {/* Free-first policy note */}
      <div className="flex items-center gap-2 rounded-2xl border border-success-500/20 bg-success-500/5 p-3">
        <Zap className="h-4 w-4 shrink-0 text-success-400" />
        <p className="text-xs text-slate-400">{t('settingsFreeFirst')}</p>
      </div>
    </div>
  );
}
