import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Info, AudioLines } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { loadJSON, saveJSON, formatDuration, formatDateLabel } from '../lib/storage';
import { sampleRecordings } from '../lib/sampleData';
import type { VoiceRecording } from '../types';
import { Mic as VoiceIcon } from 'lucide-react';

const KEY = 'mah-ai-recordings';

export function VoiceView({ onBack }: { onBack: () => void }) {
  const { t, lang } = useI18n();
  const [recordings, setRecordings] = useState<VoiceRecording[]>(() => loadJSON(KEY, sampleRecordings));
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recording]);

  const startRecording = () => {
    setRecording(true);
    setElapsed(0);
  };

  const stopRecording = () => {
    setRecording(false);
    if (elapsed > 0) {
      const rec: VoiceRecording = {
        id: Date.now().toString(),
        name: `${t('recordings')} ${recordings.length + 1}`,
        duration: elapsed,
        date: Date.now(),
        size: elapsed * 8000,
      };
      setRecordings((r) => [rec, ...r]);
    }
    setElapsed(0);
  };

  const togglePlay = (rec: VoiceRecording) => {
    if (playingId === rec.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      audioRef.current?.pause();
      // No actual audio file — simulate playback progress visually
      setPlayingId(rec.id);
    }
  };

  const deleteRec = (id: string) => {
    setRecordings((r) => r.filter((x) => x.id !== id));
    if (playingId === id) setPlayingId(null);
  };

  return (
    <div className="animate-fade-in">
      <SectionHeader title={t('secVoice')} subtitle={t('secVoiceDesc')} icon={VoiceIcon} onBack={onBack} />

      {/* Voice orb */}
      <div className="relative mb-6 flex flex-col items-center justify-center py-8">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`relative flex h-32 w-32 items-center justify-center rounded-full transition-all duration-300 ${
            recording
              ? 'bg-gradient-to-br from-danger-500 to-aura-500 shadow-glow-danger animate-pulse-glow'
              : 'bg-gradient-to-br from-electric-600 to-aura-500 shadow-glow'
          }`}
        >
          {recording ? (
            <Square className="h-10 w-10 text-white" fill="currentColor" />
          ) : (
            <Mic className="h-12 w-12 text-white" />
          )}
          {recording && (
            <span className="absolute inset-0 rounded-full border-2 border-electric-400/40 animate-ping" />
          )}
        </button>
        <p className="mt-4 text-base font-semibold text-white">
          {recording ? t('voiceListening') : t('voiceTap')}
        </p>
        {recording && (
          <p className="mt-1 font-mono text-2xl text-electric-400">{formatDuration(elapsed)}</p>
        )}
        <p className="mt-2 text-xs text-slate-500">{t('voiceHint')}</p>
      </div>

      {/* Info banner */}
      <div className="mb-5 flex items-start gap-2 rounded-2xl border border-aura-500/20 bg-aura-500/5 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-aura-400" />
        <p className="text-xs text-slate-400">{t('voiceComingSoon')}</p>
      </div>

      {/* Recordings list */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="section-title text-sm">{t('recordings')}</h3>
        <span className="chip">{recordings.length}</span>
      </div>

      {recordings.length === 0 ? (
        <EmptyState icon={<AudioLines className="h-7 w-7" />} title={t('noRecordings')} />
      ) : (
        <div className="space-y-2">
          {recordings.map((rec) => (
            <div
              key={rec.id}
              className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-electric-500/20"
            >
              <button
                onClick={() => togglePlay(rec)}
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
              <button
                onClick={() => deleteRec(rec.id)}
                className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-danger-500/10 hover:text-danger-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
