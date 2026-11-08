import { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { MessageSquare as ChatIcon } from 'lucide-react';
import { loadJSON } from '../lib/storage';
import type { ProviderSettings } from '../types';

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: number;
}

const TOKEN_KEY = 'smart-me-access-token';
const SETTINGS_KEY = 'smart-me-provider-settings';

export function ChatView({ onBack }: { onBack: () => void }) {
  const { t, dir } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const token = loadJSON<string>(TOKEN_KEY, '');
    if (!token) {
      setError(t('chatMissingToken'));
      return;
    }

    const settings = loadJSON<ProviderSettings>(SETTINGS_KEY, {
      activeProvider: 'gemini',
      activeModel: 'gemini-2.0-flash',
      configured: { gemini: false, groq: false, openrouter: false },
    });

    const nextMessages: Msg[] = [...messages, { id: crypto.randomUUID(), role: 'user', text, time: Date.now() }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Smart-Me-Token': token },
        body: JSON.stringify({
          provider: settings.activeProvider,
          model: settings.activeModel,
          messages: nextMessages.map(({ role, text: content }) => ({ role, content })),
        }),
      });
      const payload = await response.json() as { content?: string; error?: string };
      if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
      if (!payload.content) throw new Error(t('chatEmptyResponse'));
      setMessages((current) => [...current, {
        id: crypto.randomUUID(), role: 'assistant', text: payload.content!, time: Date.now(),
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('chatRequestFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-64px)] flex-col">
      <SectionHeader
        title={t('secChat')}
        subtitle={t('secChatDesc')}
        icon={ChatIcon}
        onBack={onBack}
        action={
          <button
            onClick={() => { setMessages([]); setError(''); }}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-electric-500/40 hover:text-white disabled:opacity-40"
            aria-label={t('newChat')}
          >
            <Plus className="h-4 w-4" />
          </button>
        }
      />

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-1 pb-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center animate-fade-in">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-electric-500/20 bg-electric-500/10 text-electric-400 shadow-glow">
              <MessageSquare className="h-10 w-10" />
            </div>
            <p className="text-base font-semibold text-white">{t('appName')} AI</p>
            <p className="mt-1 max-w-xs text-sm text-slate-400">{t('chatEmpty')}</p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex animate-fade-in ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === 'user'
                  ? 'rounded-br-md bg-gradient-to-br from-electric-600 to-electric-500 text-white shadow-glow-sm'
                  : 'rounded-bl-md border border-white/10 bg-white/[0.03] text-slate-200'
              }`}
              dir={dir}
            >
              {m.role === 'assistant' && (
                <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-electric-400">
                  <Sparkles className="h-3 w-3" />{t('appName')}
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />{t('chatThinking')}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div role="alert" className="mx-1 mb-2 flex items-start gap-2 rounded-xl border border-warning-500/20 bg-warning-500/5 p-3 text-xs text-warning-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="border-t border-white/5 bg-ink-950/50 p-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), void send())}
            placeholder={t('chatPlaceholder')}
            className="input-field flex-1"
            dir={dir}
            disabled={loading}
          />
          <button onClick={() => void send()} disabled={!input.trim() || loading} className="btn-glow h-12 w-12 !px-0">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 rtl:rotate-180" />}
          </button>
        </div>
      </div>
    </div>
  );
}
