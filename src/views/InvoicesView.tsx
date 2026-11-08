import { useState } from 'react';
import { Plus, FileText, Trash2, Eye, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { loadJSON, saveJSON, uid, formatCurrency, formatDateLabel, todayISO } from '../lib/storage';
import { sampleInvoices } from '../lib/sampleData';
import type { Invoice, InvoiceItem } from '../types';
import { FileText as InvIcon } from 'lucide-react';

const KEY = 'mah-ai-invoices';

export function InvoicesView({ onBack }: { onBack: () => void }) {
  const { t, lang } = useI18n();
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadJSON(KEY, sampleInvoices));
  const [tab, setTab] = useState<'invoice' | 'quotation'>('invoice');
  const [createOpen, setCreateOpen] = useState(false);
  const [viewing, setViewing] = useState<Invoice | null>(null);
  const [form, setForm] = useState({ customer: '', date: todayISO(), dueDate: '' });
  const [items, setItems] = useState<InvoiceItem[]>([{ id: uid(), description: '', qty: 1, price: 0 }]);

  const persist = (next: Invoice[]) => {
    setInvoices(next);
    saveJSON(KEY, next);
  };

  const filtered = invoices.filter((i) => i.type === tab);

  const statusColor: Record<Invoice['status'], string> = {
    paid: 'text-success-400 bg-success-500/10 border-success-500/20',
    unpaid: 'text-danger-400 bg-danger-500/10 border-danger-500/20',
    sent: 'text-electric-400 bg-electric-500/10 border-electric-500/20',
    draft: 'text-slate-400 bg-white/[0.03] border-white/10',
    overdue: 'text-warning-400 bg-warning-500/10 border-warning-500/20',
  };

  const computeTotal = (inv: Invoice) => inv.items.reduce((s, it) => s + it.qty * it.price, 0);

  const createInvoice = () => {
    if (!form.customer.trim()) return;
    const validItems = items.filter((i) => i.description.trim());
    if (validItems.length === 0) return;
    const prefix = tab === 'invoice' ? 'INV' : 'QUO';
    const num = `${prefix}-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    const inv: Invoice = {
      id: uid(),
      number: num,
      type: tab,
      customer: form.customer.trim(),
      date: form.date,
      dueDate: form.dueDate || undefined,
      items: validItems,
      status: 'draft',
    };
    persist([inv, ...invoices]);
    setForm({ customer: '', date: todayISO(), dueDate: '' });
    setItems([{ id: uid(), description: '', qty: 1, price: 0 }]);
    setCreateOpen(false);
  };

  const remove = (id: string) => persist(invoices.filter((i) => i.id !== id));

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title={t('secInvoices')}
        subtitle={t('secInvoicesDesc')}
        icon={InvIcon}
        onBack={onBack}
        action={
          <button onClick={() => setCreateOpen(true)} className="btn-glow !px-3 !py-2 text-xs">
            <Plus className="h-4 w-4" />
            {t('new')}
          </button>
        }
      />

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {(['invoice', 'quotation'] as const).map((tp) => (
          <button
            key={tp}
            onClick={() => setTab(tp)}
            className={`flex-1 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all ${
              tab === tp
                ? 'border-electric-500/40 bg-electric-500/10 text-electric-300 shadow-glow-sm'
                : 'border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            {tp === 'invoice' ? t('invoices') : t('quotations')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<FileText className="h-7 w-7" />} title={t('noInvoices')} />
      ) : (
        <div className="space-y-2">
          {filtered.map((inv) => (
            <div
              key={inv.id}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-electric-500/20"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{inv.number}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{inv.customer}</p>
                </div>
                <span className={`chip ${statusColor[inv.status]}`}>{t(inv.status)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">{formatDateLabel(inv.date, lang)}</span>
                <span className="text-base font-bold text-electric-300">{formatCurrency(computeTotal(inv), lang)}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setViewing(inv)}
                  className="btn-ghost !py-1.5 !text-xs flex-1"
                >
                  <Eye className="h-3.5 w-3.5" /> {t('viewAll')}
                </button>
                <button
                  onClick={() => remove(inv.id)}
                  className="btn-danger !py-1.5 !text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={tab === 'invoice' ? t('addInvoice') : t('addQuotation')}
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} className="btn-ghost flex-1">{t('cancel')}</button>
            <button onClick={createInvoice} className="btn-glow flex-1">{t('save')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('customer')}</label>
            <input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} className="input-field" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t('date')}</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label">{t('dueDate')}</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">{t('items')}</label>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2">
                  <input
                    value={item.description}
                    onChange={(e) => setItems(items.map((it) => it.id === item.id ? { ...it, description: e.target.value } : it))}
                    placeholder={t('description')}
                    className="input-field flex-1"
                  />
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => setItems(items.map((it) => it.id === item.id ? { ...it, qty: parseInt(e.target.value) || 1 } : it))}
                    className="input-field w-16"
                    placeholder={t('qty')}
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => setItems(items.map((it) => it.id === item.id ? { ...it, price: parseFloat(e.target.value) || 0 } : it))}
                    className="input-field w-24"
                    placeholder={t('price')}
                  />
                  {items.length > 1 && (
                    <button
                      onClick={() => setItems(items.filter((it) => it.id !== item.id))}
                      className="rounded-xl border border-white/10 px-2 text-slate-500 hover:text-danger-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setItems([...items, { id: uid(), description: '', qty: 1, price: 0 }])}
              className="btn-ghost mt-2 w-full !py-2"
            >
              <Plus className="h-4 w-4" /> {t('add')}
            </button>
          </div>
        </div>
      </Modal>

      {/* View modal */}
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.number ?? ''}
        footer={<button onClick={() => setViewing(null)} className="btn-glow w-full">{t('close')}</button>}
      >
        {viewing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">{t('customer')}</p>
                <p className="text-sm font-semibold text-white">{viewing.customer}</p>
              </div>
              <span className={`chip ${statusColor[viewing.status]}`}>{t(viewing.status)}</span>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              {viewing.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
                  <div>
                    <p className="text-sm text-white">{it.description}</p>
                    <p className="text-xs text-slate-500">{it.qty} × {formatCurrency(it.price, lang)}</p>
                  </div>
                  <p className="text-sm font-medium text-electric-300">{formatCurrency(it.qty * it.price, lang)}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-electric-500/10 px-4 py-3">
              <span className="text-sm font-semibold text-white">{t('total')}</span>
              <span className="text-lg font-bold text-electric-300">{formatCurrency(computeTotal(viewing), lang)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
