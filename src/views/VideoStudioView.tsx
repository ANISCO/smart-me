import { useState } from 'react';
import { Plus, Trash2, Mic, Music, Subtitles, Info, Play, Sparkles, Clapperboard } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { loadJSON, saveJSON, uid } from '../lib/storage';
import type { VideoProject, VideoScene } from '../types';
import { Video as VsIcon } from 'lucide-react';

const KEY = 'smart-me-video-projects';

const sampleProjects: VideoProject[] = [
  {
    id: 'vp1', name: 'فيديو منتج فاخر', format: '9:16', status: 'configured', createdAt: Date.now() - 86400000,
    scenes: [
      { id: 's1', order: 1, imageName: 'صورة منتج أمامية', duration: 3, transition: 'fade' },
      { id: 's2', order: 2, imageName: 'صورة منتج جانبية', duration: 4, transition: 'slide' },
    ],
    voiceover: { language: 'ar', gender: 'female', text: 'اكتشف منتجنا الجديد بتصميم استثنائي وجودة عالية' },
    backgroundMusic: true, subtitles: true, branding: true,
  },
  {
    id: 'vp2', name: 'إعلان تشكيلة جديدة', format: '16:9', status: 'draft', createdAt: Date.now() - 172800000,
    scenes: [{ id: 's3', order: 1, imageName: 'صورة المجموعة', duration: 5, transition: 'zoom' }],
    voiceover: { language: 'en', gender: 'male', text: 'Introducing our new collection' },
    backgroundMusic: false, subtitles: true, branding: false,
  },
];

const TRANSITIONS = ['fade', 'slide', 'zoom'] as const;
const VOICE_LANGS = ['ar', 'tr', 'en', 'fr'] as const;

export function VideoStudioView({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [projects, setProjects] = useState<VideoProject[]>(() => loadJSON(KEY, sampleProjects));
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', format: '9:16' as VideoProject['format'],
    voiceLang: 'ar' as VideoProject['voiceover']['language'],
    voiceGender: 'female' as VideoProject['voiceover']['gender'],
    voiceText: '', music: true, subtitles: true, branding: true,
  });
  const [scenes, setScenes] = useState<VideoScene[]>([{ id: uid(), order: 1, imageName: '', duration: 3, transition: 'fade' }]);

  const persist = (next: VideoProject[]) => { setProjects(next); saveJSON(KEY, next); };

  const createProject = () => {
    if (!form.name.trim()) return;
    const proj: VideoProject = {
      id: uid(), name: form.name.trim(), format: form.format, status: 'configured', createdAt: Date.now(),
      scenes: scenes.filter((s) => (s.imageName ?? '').trim()),
      voiceover: { language: form.voiceLang, gender: form.voiceGender, text: form.voiceText },
      backgroundMusic: form.music, subtitles: form.subtitles, branding: form.branding,
    };
    persist([proj, ...projects]);
    setForm({ name: '', format: '9:16', voiceLang: 'ar', voiceGender: 'female', voiceText: '', music: true, subtitles: true, branding: true });
    setScenes([{ id: uid(), order: 1, imageName: '', duration: 3, transition: 'fade' }]);
    setCreateOpen(false);
  };

  const removeProject = (id: string) => persist(projects.filter((p) => p.id !== id));

  const statusBadge = (status: VideoProject['status']) => {
    const colors: Record<VideoProject['status'], string> = {
      draft: 'text-slate-400 bg-white/[0.03] border-white/10',
      configured: 'text-electric-400 bg-electric-500/10 border-electric-500/20',
      generating: 'text-warning-400 bg-warning-500/10 border-warning-500/20',
      ready: 'text-success-400 bg-success-500/10 border-success-500/20',
    };
    return colors[status];
  };

  const formatAspect = (fmt: VideoProject['format']) => {
    const dims: Record<VideoProject['format'], string> = { '9:16': 'h-16 w-9', '1:1': 'h-16 w-16', '16:9': 'h-9 w-16' };
    return dims[fmt];
  };

  return (
    <div className="animate-fade-in">
      <SectionHeader title={t('secVideostudio')} subtitle={t('secVideostudioDesc')} icon={VsIcon} onBack={onBack}
        action={<button onClick={() => setCreateOpen(true)} className="btn-glow !px-3 !py-2 text-xs"><Plus className="h-4 w-4" />{t('vsNewProject')}</button>}
      />

      {/* Coming soon */}
      <div className="mb-4 flex items-start gap-2 rounded-2xl border border-aura-500/20 bg-aura-500/5 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-aura-400" />
        <p className="text-xs text-slate-400">{t('vsComingSoon')}</p>
      </div>

      {projects.length === 0 ? (
        <EmptyState icon={<Clapperboard className="h-7 w-7" />} title={t('vsNoProjects')} />
      ) : (
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:border-aura-500/20">
              <div className="flex items-start gap-3">
                {/* Format preview */}
                <div className={`flex ${formatAspect(proj.format)} shrink-0 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-aura-500/15 to-electric-500/10`}>
                  <Play className="h-4 w-4 text-aura-300" fill="currentColor" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{proj.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="chip !py-0.5">{proj.format}</span>
                    <span className={`chip !py-0.5 ${statusBadge(proj.status)}`}>{t(proj.status === 'configured' ? 'vsConfigured' : proj.status)}</span>
                    <span className="chip !py-0.5">{proj.scenes.length} {t('vsScenes')}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                    {proj.voiceover && <span className="flex items-center gap-1 text-slate-500"><Mic className="h-3 w-3" />{proj.voiceover.language} · {proj.voiceover.gender === 'male' ? t('vsMale') : t('vsFemale')}</span>}
                    {proj.backgroundMusic && <span className="flex items-center gap-1 text-slate-500"><Music className="h-3 w-3" />{t('vsBackgroundMusic')}</span>}
                    {proj.subtitles && <span className="flex items-center gap-1 text-slate-500"><Subtitles className="h-3 w-3" />{t('vsSubtitles')}</span>}
                    {proj.branding && <span className="flex items-center gap-1 text-slate-500"><Sparkles className="h-3 w-3" />{t('vsBranding')}</span>}
                  </div>
                </div>
                <button onClick={() => removeProject(proj.id)} className="rounded-lg p-2 text-slate-600 opacity-0 transition-all hover:bg-danger-500/10 hover:text-danger-400 group-hover:opacity-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={t('vsNewProject')}
        footer={<><button onClick={() => setCreateOpen(false)} className="btn-ghost flex-1">{t('cancel')}</button><button onClick={createProject} className="btn-glow flex-1">{t('save')}</button></>}
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('title')}</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" autoFocus />
          </div>
          <div>
            <label className="label">{t('vsFormat')}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['9:16', '1:1', '16:9'] as const).map((fmt) => (
                <button key={fmt} onClick={() => setForm({ ...form, format: fmt })}
                  className={`rounded-xl border py-3 text-center text-xs font-medium transition-all ${form.format === fmt ? 'border-aura-500/40 bg-aura-500/10 text-aura-300' : 'border-white/10 text-slate-400'}`}>
                  <div className={`mx-auto mb-1.5 rounded border ${form.format === fmt ? 'border-aura-400' : 'border-slate-600'} ${formatAspect(fmt)}`} />
                  {fmt === '9:16' ? t('vsPortrait') : fmt === '1:1' ? t('vsSquare') : t('vsLandscape')}
                </button>
              ))}
            </div>
          </div>
          {/* Scenes */}
          <div>
            <label className="label">{t('vsScenes')}</label>
            <div className="space-y-2">
              {scenes.map((scene, idx) => (
                <div key={scene.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-2">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="chip !py-0.5">{t('vsScene')} {idx + 1}</span>
                    {scenes.length > 1 && <button onClick={() => setScenes(scenes.filter((s) => s.id !== scene.id))} className="ms-auto text-slate-500 hover:text-danger-400"><Trash2 className="h-3.5 w-3.5" /></button>}
                  </div>
                  <div className="flex gap-2">
                    <input value={scene.imageName} onChange={(e) => setScenes(scenes.map((s) => s.id === scene.id ? { ...s, imageName: e.target.value } : s))} placeholder={t('vsImage')} className="input-field flex-1 !py-2" />
                    <input type="number" value={scene.duration} onChange={(e) => setScenes(scenes.map((s) => s.id === scene.id ? { ...s, duration: parseInt(e.target.value) || 1 } : s))} className="input-field w-16 !py-2" placeholder={t('vsDuration')} />
                    <select value={scene.transition} onChange={(e) => setScenes(scenes.map((s) => s.id === scene.id ? { ...s, transition: e.target.value as VideoScene['transition'] } : s))} className="input-field w-24 !py-2">
                      {TRANSITIONS.map((tr) => <option key={tr} value={tr}>{tr}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setScenes([...scenes, { id: uid(), order: scenes.length + 1, imageName: '', duration: 3, transition: 'fade' }])} className="btn-ghost mt-2 w-full !py-2">
              <Plus className="h-4 w-4" /> {t('vsAddScene')}
            </button>
          </div>
          {/* Voiceover */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center gap-2"><Mic className="h-4 w-4 text-aura-400" /><span className="text-xs font-medium text-white">{t('vsVoiceover')}</span></div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">{t('vsVoiceLang')}</label>
                <select value={form.voiceLang} onChange={(e) => setForm({ ...form, voiceLang: e.target.value as VideoProject['voiceover']['language'] })} className="input-field !py-2">
                  {VOICE_LANGS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="label">{t('vsVoiceGender')}</label>
                <div className="grid grid-cols-2 gap-1">
                  <button onClick={() => setForm({ ...form, voiceGender: 'male' })} className={`rounded-lg border py-2 text-xs ${form.voiceGender === 'male' ? 'border-aura-500/40 bg-aura-500/10 text-aura-300' : 'border-white/10 text-slate-400'}`}>{t('vsMale')}</button>
                  <button onClick={() => setForm({ ...form, voiceGender: 'female' })} className={`rounded-lg border py-2 text-xs ${form.voiceGender === 'female' ? 'border-aura-500/40 bg-aura-500/10 text-aura-300' : 'border-white/10 text-slate-400'}`}>{t('vsFemale')}</button>
                </div>
              </div>
            </div>
            <textarea value={form.voiceText} onChange={(e) => setForm({ ...form, voiceText: e.target.value })} placeholder={t('vsVoiceText')} className="input-field mt-2 min-h-[60px] resize-none" />
          </div>
          {/* Options */}
          <div className="grid grid-cols-3 gap-2">
            {[{ key: 'music' as const, icon: Music, label: t('vsBackgroundMusic') }, { key: 'subtitles' as const, icon: Subtitles, label: t('vsSubtitles') }, { key: 'branding' as const, icon: Sparkles, label: t('vsBranding') }].map(({ key, icon: Icon, label }) => (
              <button key={key} onClick={() => setForm({ ...form, [key]: !form[key] })}
                className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-[10px] font-medium transition-all ${form[key] ? 'border-electric-500/40 bg-electric-500/10 text-electric-300' : 'border-white/10 text-slate-500'}`}>
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
