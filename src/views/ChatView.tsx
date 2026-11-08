import { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, Sparkles, Info } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { MessageSquare as ChatIcon } from 'lucide-react';

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: number;
}

export function ChatView({ onBack }: { onBack: () => void }) {
  const { t, dir } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { id: Date.now().toString(), role: 'user', text, time: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
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
            onClick={() => setMessages([])}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-electric-500/40 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        }
      />

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-1 pb-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center animate-fade-in">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-electric-500/20 bg-electric-500/10 text-electric-400 shadow-glow">
              <MessageSquare className="h-10 w-10" />
            </div>
            <p className="text-base font-semibold text-white">{t('appName')} AI</p>
            <p className="mt-1 max-w-xs text-sm text-slate-400">{t('chatEmpty')}</p>
            <div className="mt-6 max-w-sm rounded-2xl border border-aura-500/20 bg-aura-500/5 p-3 text-start">
              <div className="flex items-center gap-2 text-aura-300">
                <Info className="h-4 w-4" />
                <span className="text-xs font-medium">{t('comingSoon')}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{t('chatComingSoon')}</p>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex animate-fade-in ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === 'user'
                    ? 'rounded-br-md bg-gradient-to-br from-electric-600 to-electric-500 text-white shadow-glow-sm'
                    : 'rounded-bl-md border border-white/10 bg-white/[0.03] text-slate-200'
                }`}
                dir={dir}
              >
                {m.role === 'assistant' && (
                  <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-electric-400">
                    <Sparkles className="h-3 w-3" />
                    {t('appName')}
                  </div>
                )}
                <p className="leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-white/5 bg-ink-950/50 p-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={t('chatPlaceholder')}
            className="input-field flex-1"
            dir={dir}
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="btn-glow h-12 w-12 !px-0"
          >
            <Send className="h-5 w-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
