import { useState, useEffect } from 'react';
import { FileText, Image, File, Upload, Search, FolderOpen, HardDrive } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { loadJSON, saveJSON, formatBytes, formatDateLabel } from '../lib/storage';
import { sampleFiles } from '../lib/sampleData';
import type { FileItem } from '../types';
import { FolderOpen as FilesIcon } from 'lucide-react';

const KEY = 'mah-ai-files';

export function FilesView({ onBack }: { onBack: () => void }) {
  const { t, lang } = useI18n();
  const [files, setFiles] = useState<FileItem[]>(() => loadJSON(KEY, sampleFiles));
  const [filter, setFilter] = useState<'all' | 'document' | 'image' | 'other'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    saveJSON(KEY, files);
  });

  const filtered = files.filter((f) => {
    if (filter !== 'all' && f.type !== filter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalSize = files.reduce((s, f) => s + f.size, 0);

  const typeIcon = (type: FileItem['type']) => {
    if (type === 'document') return <FileText className="h-5 w-5 text-electric-400" />;
    if (type === 'image') return <Image className="h-5 w-5 text-aura-400" />;
    return <File className="h-5 w-5 text-slate-400" />;
  };

  const typeBg = (type: FileItem['type']) => {
    if (type === 'document') return 'bg-electric-500/10';
    if (type === 'image') return 'bg-aura-500/10';
    return 'bg-white/[0.03]';
  };

  const filters: { key: typeof filter; label: string; count: number }[] = [
    { key: 'all', label: t('allFiles'), count: files.length },
    { key: 'document', label: t('documents'), count: files.filter((f) => f.type === 'document').length },
    { key: 'image', label: t('images2'), count: files.filter((f) => f.type === 'image').length },
    { key: 'other', label: t('others'), count: files.filter((f) => f.type === 'other').length },
  ];

  return (
    <div className="animate-fade-in">
      <SectionHeader title={t('secFiles')} subtitle={t('secFilesDesc')} icon={FilesIcon} onBack={onBack} />

      {/* Storage */}
      <div className="card-surface mb-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-electric-400" />
            <span className="text-xs text-slate-400">{t('storageUsed')}</span>
          </div>
          <span className="text-sm font-bold text-white">{formatBytes(totalSize)}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-electric-500 to-aura-500 transition-all"
            style={{ width: `${Math.min((totalSize / (50 * 1024 * 1024)) * 100, 100)}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-slate-500">/ 50 MB</p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search')}
          className="input-field !ps-10"
        />
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
              filter === f.key
                ? 'border-electric-500/40 bg-electric-500/10 text-electric-300'
                : 'border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            {f.label}
            <span className="text-[10px] opacity-60">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Upload button */}
      <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-electric-500/30 bg-electric-500/5 py-4 text-sm font-medium text-electric-400 transition-all hover:border-electric-500/50 hover:bg-electric-500/10">
        <Upload className="h-5 w-5" />
        {t('upload')}
      </button>

      {/* Files */}
      {filtered.length === 0 ? (
        <EmptyState icon={<FolderOpen className="h-7 w-7" />} title={t('noFiles')} />
      ) : (
        <div className="space-y-2">
          {filtered.map((f) => (
            <div
              key={f.id}
              className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-electric-500/20"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${typeBg(f.type)}`}>
                {typeIcon(f.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{f.name}</p>
                <p className="text-xs text-slate-500">
                  {formatBytes(f.size)} · {formatDateLabel(new Date(f.modified).toISOString(), lang)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
