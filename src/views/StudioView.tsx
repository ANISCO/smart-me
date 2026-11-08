import { useState } from 'react';
import { Image, Video, Plus, Info, Film, Sparkles, Play } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Image as StudioIcon } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  type: 'image' | 'video';
  thumb: string;
  date: number;
}

const THUMBS = [
  'https://images.pexels.com/photos/12187128/pexels-photo-12187128.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/8108654/pexels-photo-8108654.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/18419508/pexels-photo-18419508.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/12537427/pexels-photo-12537427.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/12537428/pexels-photo-12537428.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/36581425/pexels-photo-36581425.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

const sampleProjects: Project[] = [
  { id: 'p1', name: 'تصميم حملة تسويقية', type: 'image', thumb: THUMBS[0], date: Date.now() - 86400000 },
  { id: 'p2', name: 'فيديو ترويجي للمنتج', type: 'video', thumb: THUMBS[1], date: Date.now() - 172800000 },
  { id: 'p3', name: 'بوستات السوشيال ميديا', type: 'image', thumb: THUMBS[2], date: Date.now() - 259200000 },
  { id: 'p4', name: 'هوية بصرية مستقبلية', type: 'image', thumb: THUMBS[3], date: Date.now() - 345600000 },
  { id: 'p5', name: 'فيديو إعلاني قصير', type: 'video', thumb: THUMBS[4], date: Date.now() - 432000000 },
  { id: 'p6', name: 'تصاميم نيون', type: 'image', thumb: THUMBS[5], date: Date.now() - 518400000 },
];

export function StudioView({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<'image' | 'video'>('image');
  const [projects] = useState<Project[]>(sampleProjects);

  const filtered = projects.filter((p) => p.type === tab);

  return (
    <div className="animate-fade-in">
      <SectionHeader title={t('secStudio')} subtitle={t('secStudioDesc')} icon={StudioIcon} onBack={onBack} />

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab('image')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all ${
            tab === 'image' ? 'border-aura-500/40 bg-aura-500/10 text-aura-300 shadow-glow-aura' : 'border-white/10 text-slate-400 hover:border-white/20'
          }`}
        >
          <Image className="h-4 w-4" /> {t('images')}
        </button>
        <button
          onClick={() => setTab('video')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all ${
            tab === 'video' ? 'border-electric-500/40 bg-electric-500/10 text-electric-300 shadow-glow-sm' : 'border-white/10 text-slate-400 hover:border-white/20'
          }`}
        >
          <Video className="h-4 w-4" /> {t('videos')}
        </button>
      </div>

      {/* New project button */}
      <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-electric-500/30 bg-electric-500/5 py-4 text-sm font-medium text-electric-400 transition-all hover:border-electric-500/50 hover:bg-electric-500/10">
        <Plus className="h-5 w-5" />
        {t('newProject')}
      </button>

      {/* Coming soon banner */}
      <div className="mb-4 flex items-start gap-2 rounded-2xl border border-aura-500/20 bg-aura-500/5 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-aura-400" />
        <p className="text-xs text-slate-400">{t('studioComingSoon')}</p>
      </div>

      {/* Gallery */}
      <h3 className="mb-2 section-title text-sm">{t('recentProjects')}</h3>

      {filtered.length === 0 ? (
        <EmptyState icon={<Film className="h-7 w-7" />} title={t('noProjects')} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/5 bg-ink-900"
            >
              <img
                src={p.thumb}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
              {p.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-electric-500/30 backdrop-blur-sm">
                    <Play className="h-6 w-6 text-white" fill="currentColor" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="truncate text-xs font-medium text-white">{p.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <Sparkles className="h-3 w-3 text-aura-400" />
        {t('aiIntegrationReady')}
      </div>
    </div>
  );
}
