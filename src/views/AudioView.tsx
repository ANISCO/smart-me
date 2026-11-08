import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Info, AudioLines, FileText, Waves } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { loadJSON, saveJSON, formatDuration, formatDateLabel } from '../lib/storage';
import { sampleRecordings } from '../lib/sampleData';
import type { VoiceRecording } from '../types';
import { AudioLines as AudioIcon } from 'lucide-react';

const KEY = 'mah-ai-audio-recordings';

export function AudioView({ onBack }: { onBack: () => void }) {
  const { t, lang } = useI18n();
  const [recordings, setRecordings] = useState<VoiceRecording[]>(() => loadJSON(KEY, sampleRecordings));
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    saveJSON(KEY, recordings);
  }, [recordings]);

  useEffect(() => {
    if (recording) {
      timerRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recording]);

  const start = () => { setRecording(true); setElapsed(0); };
  const stop = () => {
    setRecording(false);
    if (elapsed > 0) {
      setRecordings((r) => [{
        id: Date.now().toString(),
        name: `${t('recordings')} ${r.length + 1}`,
        duration: elapsed,
        date: Date.now(),
        size: elapsed * 8000,
      }, ...r]);
    }
    setElapsed(0);
  };

  const togglePlay = (id: string) => setPlayingId((p) => (p === id ? null : id));
  const remove = (id: string) => setRecordings((r) => r.filter((x) => x.id !== id));

  return (
    <div className="animate-fade-in">
      <SectionHeader title={t('secAudio')} subtitle={t('secAudioDesc')} icon={AudioIcon} onBack={onBack} />

      {/* Recorder */}
      <div className="card-surface mb-4 p-5">
        <div className="flex flex-col items-center">
          {/* Waveform visualization */}
          <div className="mb-4 flex h-16 items-center gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all ${
                  recording ? 'bg-electric-400' : 'bg-white/10'
                }`}
                style={{
                  height: recording
                    ? `${20 + Math.abs(Math.sin((Date.now() / 200) + i)) * 40}px`
                    : `${8 + (i % 3) * 8}px`,
                  animation: recording ? `pulse-glow 0.8s ease-in-out ${i * 0.05}s infinite` : 'none',
                }}
              />
            ))}
          </div>

          <button
            onClick={recording ? stop : start}
            className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
              recording
                ? 'bg-gradient-to-br from-danger-500 to-aura-500 shadow-glow-danger animate-pulse-glow'
                : 'bg-gradient-to-br from-electric-600 to-aura-500 shadow-glow'
            }`}
          >
            {recording ? <Square className="h-6 w-6 text-white" fill="currentColor" /> : <Mic className="h-7 w-7 text-white" />}
          </button>

          <p className="mt-3 text-sm font-medium text-white">
            {recording ? t('stopRecording') : t('startRecording')}
          </p>
          {recording && <p className="mt-1 font-mono text-xl text-electric-400">{formatDuration(elapsed)}</p>}
        </div>
      </div>

      {/* Info */}
      <div className="mb-4 flex items-start gap-2 rounded-2xl border border-aura-500/20 bg-aura-500/5 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-aura-400" />
        <p className="text-xs text-slate-400">{t('audioComingSoon')}</p>
      </div>

      {/* Recordings */}
      <h3 className="mb-2 section-title text-sm">{t('recordings')}</h3>

      {recordings.length === 0 ? (
        <EmptyState icon={<AudioLines className="h-7 w-7" />} title={t('noRecordings')} />
      ) : (
        <div className="space-y-2">
          {recordings.map((rec) => (
            <div
              key={rec.id}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-electric-500/20"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => togglePlay(rec.id)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric-500/15 text-electric-400 transition-colors hover:bg-electric-500/25"
                >
                  {playingId === rec.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 rtl:rotate-180" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{rec.name}</p>
                  <p className="text-xs text-slate-500">
                    {formatDuration(rec.duration)} · {formatDateLabel(new Date(rec.date).toISOString(), lang)}
                  </p>
                </div>
                <button className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-aura-500/10 hover:text-aura-400">
                  <FileText className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(rec.id)}
                  className="rounded-lg p-2 text-slate-600 opacity-0 transition-all hover:bg-danger-500/10 hover:text-danger-400 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {/* Mini waveform */}
              {playingId === rec.id && (
                <div className="mt-2 flex h-8 items-center gap-0.5 rounded-lg bg-ink-950/40 px-2">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 rounded-full bg-electric-400/60"
                      style={{ height: `${4 + Math.abs(Math.sin(i * 0.5)) * 20}px` }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Effects showcase */}
      <div className="mt-5">
        <h3 className="mb-2 section-title text-sm">{t('effects')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Waves, label: 'Reverb', color: 'text-aura-400' },
            { icon: AudioLines, label: 'Boost', color: 'text-electric-400' },
            { icon: Mic, label: 'Denoise', color: 'text-success-400' },
          ].map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.02] py-4 transition-all hover:border-electric-500/20"
            >
              <Icon className={`h-5 w-5 ${color}`} />
              <span className="text-xs text-slate-400">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
