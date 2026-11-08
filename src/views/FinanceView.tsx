import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { loadJSON, saveJSON, uid, formatCurrency, formatDateLabel, todayISO } from '../lib/storage';
import { sampleTransactions } from '../lib/sampleData';
import type { Transaction } from '../types';
import { Wallet as FinanceIcon } from 'lucide-react';

const KEY = 'mah-ai-transactions';

export function FinanceView({ onBack }: { onBack: () => void }) {
  const { t, lang } = useI18n();
  const [txns, setTxns] = useState<Transaction[]>(() => loadJSON(KEY, sampleTransactions));
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [form, setForm] = useState({ amount: '', category: '', source: '', date: todayISO() });

  const persist = (next: Transaction[]) => {
    setTxns(next);
    saveJSON(KEY, next);
  };

  const addTxn = () => {
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) return;
    const txn: Transaction = {
      id: uid(),
      type,
      amount: amt,
      category: form.category || (type === 'income' ? t('income') : t('expense')),
      source: form.source || '—',
      date: form.date,
    };
    persist([txn, ...txns]);
    setForm({ amount: '', category: '', source: '', date: todayISO() });
    setModalOpen(false);
  };

  const remove = (id: string) => persist(txns.filter((x) => x.id !== id));

  const totalIncome = txns.filter((x) => x.type === 'income').reduce((s, x) => s + x.amount, 0);
  const totalExpense = txns.filter((x) => x.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const balance = totalIncome - totalExpense;

  const sorted = [...txns].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title={t('secFinance')}
        subtitle={t('secFinanceDesc')}
        icon={FinanceIcon}
        onBack={onBack}
        action={
          <button onClick={() => setModalOpen(true)} className="btn-glow !px-3 !py-2 text-xs">
            <Plus className="h-4 w-4" />
            {t('add')}
          </button>
        }
      />

      {/* Balance hero */}
      <div className="relative mb-4 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-ink-800 to-ink-900 p-5">
        <div className="absolute inset-0 bg-radial-glow opacity-40" />
        <div className="relative">
          <p className="text-xs text-slate-400">{t('balance')}</p>
          <p className="mt-1 text-3xl font-bold text-white">
            <AnimatedNumber value={balance} />
            <span className="ml-1 text-sm text-slate-400">$</span>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-success-500/15 bg-success-500/5 p-3">
              <div className="flex items-center gap-1.5 text-success-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-[11px] font-medium">{t('totalIncome')}</span>
              </div>
              <p className="mt-1 text-base font-bold text-white">{formatCurrency(totalIncome, lang)}</p>
            </div>
            <div className="rounded-2xl border border-danger-500/15 bg-danger-500/5 p-3">
              <div className="flex items-center gap-1.5 text-danger-400">
                <TrendingDown className="h-4 w-4" />
                <span className="text-[11px] font-medium">{t('totalExpense')}</span>
              </div>
              <p className="mt-1 text-base font-bold text-white">{formatCurrency(totalExpense, lang)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <h3 className="mb-2 section-title text-sm">{t('recentTransactions')}</h3>

      {sorted.length === 0 ? (
        <EmptyState icon={<Wallet className="h-7 w-7" />} title={t('noTransactions')} />
      ) : (
        <div className="space-y-2">
          {sorted.map((tx) => (
            <div
              key={tx.id}
              className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-white/10"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                tx.type === 'income' ? 'bg-success-500/10 text-success-400' : 'bg-danger-500/10 text-danger-400'
              }`}>
                {tx.type === 'income' ? <ArrowDownLeft className="h-5 w-5 rtl:rotate-0" /> : <ArrowUpRight className="h-5 w-5 rtl:rotate-180" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{tx.source}</p>
                <p className="text-xs text-slate-500">{tx.category} · {formatDateLabel(tx.date, lang)}</p>
              </div>
              <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-success-400' : 'text-danger-400'}`}>
                {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount, lang)}
              </p>
              <button
                onClick={() => remove(tx.id)}
                className="rounded-lg p-2 text-slate-600 opacity-0 transition-all hover:bg-danger-500/10 hover:text-danger-400 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('addTransaction')}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">{t('cancel')}</button>
            <button onClick={addTxn} className="btn-glow flex-1">{t('save')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('status')}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setType('income')}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  type === 'income' ? 'border-success-500/40 bg-success-500/15 text-success-400' : 'border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <TrendingUp className="mr-1.5 inline h-4 w-4" />{t('income')}
              </button>
              <button
                onClick={() => setType('expense')}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  type === 'expense' ? 'border-danger-500/40 bg-danger-500/15 text-danger-400' : 'border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <TrendingDown className="mr-1.5 inline h-4 w-4" />{t('expense')}
              </button>
            </div>
          </div>
          <div>
            <label className="label">{t('amount')}</label>
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-field" placeholder="0" autoFocus />
          </div>
          <div>
            <label className="label">{t('category')}</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">{t('source')}</label>
            <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">{t('date')}</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
