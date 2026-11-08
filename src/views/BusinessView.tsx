import { useState } from 'react';
import { Plus, Phone, Mail, Building2, Trash2, Users, TrendingUp } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { loadJSON, saveJSON, uid, formatCurrency } from '../lib/storage';
import { sampleCustomers } from '../lib/sampleData';
import type { Customer } from '../types';
import { Building2 as BizIcon } from 'lucide-react';

const KEY = 'mah-ai-customers';

export function BusinessView({ onBack }: { onBack: () => void }) {
  const { t, lang } = useI18n();
  const [customers, setCustomers] = useState<Customer[]>(() => loadJSON(KEY, sampleCustomers));
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', dealValue: '' });

  const persist = (next: Customer[]) => {
    setCustomers(next);
    saveJSON(KEY, next);
  };

  const addCustomer = () => {
    if (!form.name.trim()) return;
    const c: Customer = {
      id: uid(),
      name: form.name.trim(),
      company: form.company || undefined,
      phone: form.phone || '—',
      email: form.email || undefined,
      dealValue: parseFloat(form.dealValue) || 0,
      status: 'active',
    };
    persist([c, ...customers]);
    setForm({ name: '', company: '', phone: '', email: '', dealValue: '' });
    setModalOpen(false);
  };

  const remove = (id: string) => persist(customers.filter((c) => c.id !== id));

  const active = customers.filter((c) => c.status === 'active');
  const totalDeals = customers.reduce((s, c) => s + c.dealValue, 0);

  const statusColor: Record<Customer['status'], string> = {
    active: 'text-success-400 bg-success-500/10 border-success-500/20',
    lead: 'text-warning-400 bg-warning-500/10 border-warning-500/20',
    inactive: 'text-slate-500 bg-white/[0.03] border-white/10',
  };

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title={t('secBusiness')}
        subtitle={t('secBusinessDesc')}
        icon={BizIcon}
        onBack={onBack}
        action={
          <button onClick={() => setModalOpen(true)} className="btn-glow !px-3 !py-2 text-xs">
            <Plus className="h-4 w-4" />
            {t('add')}
          </button>
        }
      />

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="card-surface p-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Users className="h-4 w-4" />
            <span className="text-xs">{t('activeCustomers')}</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{active.length}</p>
        </div>
        <div className="card-surface p-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">{t('totalDeals')}</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-success-400">
            <AnimatedNumber value={totalDeals} prefix="" suffix="$" />
          </p>
        </div>
      </div>

      {/* Customers */}
      <h3 className="mb-2 section-title text-sm">{t('customers')}</h3>

      {customers.length === 0 ? (
        <EmptyState icon={<Building2 className="h-7 w-7" />} title={t('noCustomers')} />
      ) : (
        <div className="space-y-2">
          {customers.map((c) => (
            <div
              key={c.id}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-electric-500/20"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-electric-600/20 to-aura-500/20 text-sm font-bold text-electric-300">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-white">{c.name}</p>
                    <span className={`chip !py-0.5 ${statusColor[c.status]}`}>{c.status}</span>
                  </div>
                  {c.company && (
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
                      <Building2 className="h-3 w-3" /> {c.company}
                    </p>
                  )}
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</span>
                    {c.email && <span className="flex items-center gap-1 truncate"><Mail className="h-3 w-3" /> {c.email}</span>}
                  </div>
                  {c.dealValue > 0 && (
                    <p className="mt-1.5 text-sm font-bold text-success-400">
                      {t('dealValue')}: {formatCurrency(c.dealValue, lang)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => remove(c.id)}
                  className="rounded-lg p-2 text-slate-600 opacity-0 transition-all hover:bg-danger-500/10 hover:text-danger-400 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('addCustomer')}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">{t('cancel')}</button>
            <button onClick={addCustomer} className="btn-glow flex-1">{t('save')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('name')}</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" autoFocus />
          </div>
          <div>
            <label className="label">{t('company')}</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t('phone')}</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" dir="ltr" />
            </div>
            <div>
              <label className="label">{t('email')}</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" dir="ltr" />
            </div>
          </div>
          <div>
            <label className="label">{t('dealValue')}</label>
            <input type="number" value={form.dealValue} onChange={(e) => setForm({ ...form, dealValue: e.target.value })} className="input-field" placeholder="0" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
