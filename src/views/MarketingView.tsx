import { useState } from 'react';
import { Megaphone, Plus, Trash2, Info, Download, Hash, Image as ImageIcon, Sparkles, Instagram, Facebook, Layers } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { loadJSON, saveJSON, uid, formatDateLabel } from '../lib/storage';
import type { MarketingCampaign } from '../types';
import { Megaphone as MktIcon } from 'lucide-react';

const KEY = 'smart-me-campaigns';

const sampleCampaigns: MarketingCampaign[] = [
  {
    id: 'mc1', name: 'حملة منتج الصيف', platform: 'instagram_post', language: 'ar', status: 'ready', createdAt: Date.now() - 86400000,
    productIds: ['pi1', 'pi2'], caption: 'اكتشف تشكيلة الصيف الجديدة بأسعار مميزة!', hashtags: ['#تسوق', '#منتجات_جديدة', '#عروض'], callToAction: 'اطلب الآن', template: 'modern',
  },
  {
    id: 'mc2', name: 'إعلان Facebook شهري', platform: 'facebook_post', language: 'ar', status: 'draft', createdAt: Date.now() - 172800000,
    productIds: ['pi3'], caption: 'منتجات عالية الجودة بأسعار تنافسية', hashtags: ['#جودة', '#منتجات'], callToAction: 'زر الموقع للمزيد', template: 'classic',
  },
];

const PLATFORM_META: Record<MarketingCampaign['platform'], { icon: typeof Instagram; labelKey: string }> = {
  instagram_post: { icon: Instagram, labelKey: 'mktIgPost' },
  instagram_story: { icon: Instagram, labelKey: 'mktIgStory' },
  instagram_reel: { icon: Instagram, labelKey: 'mktIgReel' },
  facebook_post: { icon: Facebook, labelKey: 'mktFbPost' },
  carousel: { icon: Layers, labelKey: 'mktCarousel' },
};

const TEMPLATES = ['modern', 'classic', 'minimal', 'bold', 'elegant'];

export function MarketingView({ onBack }: { onBack: () => void }) {
  const { t, lang } = useI18n();
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => loadJSON(KEY, sampleCampaigns));
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', platform: 'instagram_post' as MarketingCampaign['platform'],
    language: 'ar' as MarketingCampaign['language'],
    caption: '', hashtags: '', callToAction: '', template: 'modern',
    includePrice: true, includeLogo: true,
  });

  const persist = (next: MarketingCampaign[]) => { setCampaigns(next); saveJSON(KEY, next); };

  const createCampaign = () => {
    if (!form.name.trim()) return;
    const camp: MarketingCampaign = {
      id: uid(), name: form.name.trim(), platform: form.platform, language: form.language,
      status: 'draft', createdAt: Date.now(), productIds: [],
      caption: form.caption, hashtags: form.hashtags.split(/[,،\s]+/).filter(Boolean),
      callToAction: form.callToAction, template: form.template,
    };
    persist([camp, ...campaigns]);
    setForm({ name: '', platform: 'instagram_post', language: 'ar', caption: '', hashtags: '', callToAction: '', template: 'modern', includePrice: true, includeLogo: true });
    setCreateOpen(false);
  };

  const remove = (id: string) => persist(campaigns.filter((c) => c.id !== id));

  return (
    <div className="animate-fade-in">
      <SectionHeader title={t('secMarketing')} subtitle={t('secMarketingDesc')} icon={MktIcon} onBack={onBack}
        action={<button onClick={() => setCreateOpen(true)} className="btn-glow !px-3 !py-2 text-xs"><Plus className="h-4 w-4" />{t('mktNewCampaign')}</button>}
      />

      <div className="mb-4 flex items-start gap-2 rounded-2xl border border-aura-500/20 bg-aura-500/5 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-aura-400" />
        <p className="text-xs text-slate-400">{t('mktComingSoon')}</p>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState icon={<Megaphone className="h-7 w-7" />} title={t('mktNoCampaigns')} />
      ) : (
        <div className="space-y-3">
          {campaigns.map((camp) => {
            const meta = PLATFORM_META[camp.platform];
            const Icon = meta.icon;
            return (
              <div key={camp.id} className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:border-aura-500/20">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-aura-500/20 to-electric-500/10 text-aura-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{camp.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{t(meta.labelKey)} · {camp.language.toUpperCase()}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className={`chip !py-0.5 ${camp.status === 'ready' ? 'border-success-500/20 bg-success-500/5 text-success-300' : 'border-white/10 text-slate-400'}`}>{camp.status === 'ready' ? t('vsReady') : t('vsDraft')}</span>
                      <span className="chip !py-0.5">{formatDateLabel(new Date(camp.createdAt).toISOString(), lang)}</span>
                    </div>
                    {camp.caption && <p className="mt-2 line-clamp-2 text-xs text-slate-500">{camp.caption}</p>}
                    {camp.hashtags.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {camp.hashtags.slice(0, 4).map((h, i) => (
                          <span key={i} className="text-[10px] text-aura-400">{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button className="rounded-lg p-2 text-slate-500 hover:bg-aura-500/10 hover:text-aura-400"><Download className="h-4 w-4" /></button>
                    <button onClick={() => remove(camp.id)} className="rounded-lg p-2 text-slate-600 opacity-0 transition-all hover:bg-danger-500/10 hover:text-danger-400 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={t('mktNewCampaign')}
        footer={<><button onClick={() => setCreateOpen(false)} className="btn-ghost flex-1">{t('cancel')}</button><button onClick={createCampaign} className="btn-glow flex-1">{t('save')}</button></>}
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('title')}</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" autoFocus />
          </div>
          <div>
            <label className="label">{t('mktPlatform')}</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PLATFORM_META) as MarketingCampaign['platform'][]).map((p) => {
                const meta = PLATFORM_META[p];
                const Icon = meta.icon;
                return (
                  <button key={p} onClick={() => setForm({ ...form, platform: p })}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${form.platform === p ? 'border-aura-500/40 bg-aura-500/10 text-aura-300' : 'border-white/10 text-slate-400'}`}>
                    <Icon className="h-4 w-4" />{t(meta.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="label">{t('mktLanguage')}</label>
            <div className="grid grid-cols-4 gap-2">
              {(['ar', 'tr', 'en', 'fr'] as const).map((l) => (
                <button key={l} onClick={() => setForm({ ...form, language: l })}
                  className={`rounded-lg border py-2 text-xs font-medium transition-all ${form.language === l ? 'border-electric-500/40 bg-electric-500/10 text-electric-300' : 'border-white/10 text-slate-400'}`}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">{t('mktProducts')}</label>
            <div className="flex items-center justify-center rounded-xl border border-dashed border-electric-500/30 bg-electric-500/5 py-6 text-center">
              <div><ImageIcon className="mx-auto h-6 w-6 text-electric-400" /><p className="mt-1 text-xs text-slate-400">{t('mktSelectProducts')}</p></div>
            </div>
          </div>
          <div>
            <label className="label">{t('mktCaption')}</label>
            <textarea value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="input-field min-h-[70px] resize-none" />
          </div>
          <div>
            <label className="label">{t('mktHashtags')}</label>
            <input value={form.hashtags} onChange={(e) => setForm({ ...form, hashtags: e.target.value })} className="input-field" placeholder="#tag1 #tag2" />
          </div>
          <div>
            <label className="label">{t('mktCallToAction')}</label>
            <input value={form.callToAction} onChange={(e) => setForm({ ...form, callToAction: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">{t('mktTemplate')}</label>
            <select value={form.template} onChange={(e) => setForm({ ...form, template: e.target.value })} className="input-field">
              {TEMPLATES.map((tp) => <option key={tp} value={tp}>{tp}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setForm({ ...form, includePrice: !form.includePrice })} className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-medium transition-all ${form.includePrice ? 'border-electric-500/40 bg-electric-500/10 text-electric-300' : 'border-white/10 text-slate-500'}`}><Sparkles className="h-4 w-4" />{t('mktIncludePrice')}</button>
            <button onClick={() => setForm({ ...form, includeLogo: !form.includeLogo })} className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-medium transition-all ${form.includeLogo ? 'border-electric-500/40 bg-electric-500/10 text-electric-300' : 'border-white/10 text-slate-500'}`}><ImageIcon className="h-4 w-4" />{t('mktIncludeLogo')}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
