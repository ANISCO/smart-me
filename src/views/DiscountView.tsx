import { useState } from 'react';
import { Percent, Plus, Trash2, CheckCircle2, FileDown, AlertTriangle, Tag } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { loadJSON, saveJSON, uid, formatCurrency } from '../lib/storage';
import type { DiscountRule, PriceListItem, DiscountedItem } from '../types';
import { Percent as DiscIcon } from 'lucide-react';

const RULES_KEY = 'smart-me-discount-rules';
const ITEMS_KEY = 'smart-me-price-items';
const DISC_KEY = 'smart-me-discounted-items';

const sampleRules: DiscountRule[] = [
  { id: 'dr1', name: 'الخصم الافتراضي', type: 'default', percentage: 10, createdAt: Date.now() - 86400000 },
  { id: 'dr2', name: 'خصم شركة النور', type: 'customer', targetId: 'c1', targetName: 'شركة النور', percentage: 15, createdAt: Date.now() - 172800000 },
  { id: 'dr3', name: 'خصم قائمة المورد الرئيسي', type: 'file', targetId: 'kb1', targetName: 'قائمة أسعار المورد.pdf', percentage: 12, createdAt: Date.now() - 259200000 },
];

const samplePriceItems: PriceListItem[] = [
  { id: 'pi1', documentId: 'kb1', productCode: 'P001', productName: 'منتج أ - ممتاز', originalPrice: 100, category: 'إلكترونيات', unit: 'قطعة' },
  { id: 'pi2', documentId: 'kb1', productCode: 'P002', productName: 'منتج ب - احترافي', originalPrice: 250, category: 'إلكترونيات', unit: 'قطعة' },
  { id: 'pi3', documentId: 'kb1', productCode: 'P003', productName: 'منتج ج - قياسي', originalPrice: 180, category: 'ملحقات', unit: 'علبة' },
  { id: 'pi4', documentId: 'kb1', productCode: 'P004', productName: 'منتج د - فاخر', originalPrice: 420, category: 'إلكترونيات', unit: 'قطعة' },
  { id: 'pi5', documentId: 'kb2', productCode: 'P005', productName: 'منتج هـ - أساسي', originalPrice: 75, category: 'ملحقات', unit: 'علبة' },
];

export function DiscountView({ onBack }: { onBack: () => void }) {
  const { t, lang } = useI18n();
  const [rules, setRules] = useState<DiscountRule[]>(() => loadJSON(RULES_KEY, sampleRules));
  const [priceItems] = useState<PriceListItem[]>(() => loadJSON(ITEMS_KEY, samplePriceItems));
  const [discounted, setDiscounted] = useState<DiscountedItem[]>(() => loadJSON(DISC_KEY, []));
  const [defaultPct, setDefaultPct] = useState(() => rules.find((r) => r.type === 'default')?.percentage ?? 10);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [exportConfirm, setExportConfirm] = useState(false);
  const [form, setForm] = useState({ type: 'customer' as DiscountRule['type'], targetName: '', percentage: '' });

  const persistRules = (next: DiscountRule[]) => { setRules(next); saveJSON(RULES_KEY, next); };
  const persistDisc = (next: DiscountedItem[]) => { setDiscounted(next); saveJSON(DISC_KEY, next); };

  const updateDefault = (pct: number) => {
    setDefaultPct(pct);
    persistRules(rules.map((r) => r.type === 'default' ? { ...r, percentage: pct } : r));
  };

  const addOverride = () => {
    const pct = parseFloat(form.percentage);
    if (!pct || pct < 0 || pct > 100 || !form.targetName.trim()) return;
    const rule: DiscountRule = {
      id: uid(), name: form.targetName.trim(), type: form.type,
      targetName: form.targetName.trim(), percentage: pct, createdAt: Date.now(),
    };
    persistRules([...rules, rule]);
    setForm({ type: 'customer', targetName: '', percentage: '' });
    setOverrideOpen(false);
  };

  const removeRule = (id: string) => persistRules(rules.filter((r) => r.id !== id));

  const getDiscountForItem = (item: PriceListItem): number => {
    const fileOverride = rules.find((r) => r.type === 'file' && r.targetId === item.documentId);
    if (fileOverride) return fileOverride.percentage;
    return defaultPct;
  };

  const generateDiscounted = () => {
    const items: DiscountedItem[] = priceItems.map((item) => {
      const pct = getDiscountForItem(item);
      const discountAmount = (item.originalPrice * pct) / 100;
      return {
        id: uid(), sourceItemId: item.id, productName: item.productName, productCode: item.productCode,
        originalPrice: item.originalPrice, discountPercentage: pct, discountAmount,
        finalPrice: item.originalPrice - discountAmount, sourceDocument: 'قائمة أسعار', createdAt: Date.now(),
      };
    });
    persistDisc(items);
    setExportConfirm(false);
  };

  const overrides = rules.filter((r) => r.type !== 'default');
  const totalSaved = discounted.reduce((s, d) => s + d.discountAmount, 0);

  return (
    <div className="animate-fade-in">
      <SectionHeader title={t('secDiscount')} subtitle={t('secDiscountDesc')} icon={DiscIcon} onBack={onBack}
        action={<button onClick={() => setOverrideOpen(true)} className="btn-glow !px-3 !py-2 text-xs"><Plus className="h-4 w-4" />{t('discAddOverride')}</button>}
      />

      {/* Default discount */}
      <div className="card-surface mb-4 p-5">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-500/10 text-success-400">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{t('discDefault')}</p>
            <p className="text-xs text-slate-400">{t('discDefaultDesc')}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <input type="range" min="0" max="50" value={defaultPct} onChange={(e) => updateDefault(parseInt(e.target.value))}
            className="flex-1 accent-success-400" />
          <span className="w-16 rounded-xl bg-success-500/10 py-2 text-center text-lg font-bold text-success-400">{defaultPct}%</span>
        </div>
      </div>

      {/* Never modify notice */}
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-warning-500/20 bg-warning-500/5 p-2.5">
        <AlertTriangle className="h-4 w-4 shrink-0 text-warning-400" />
        <p className="text-xs text-slate-400">{t('discNeverModify')}</p>
      </div>

      {/* Overrides */}
      <h3 className="mb-2 section-title text-sm">{t('discOverrides')}</h3>
      {overrides.length === 0 ? (
        <EmptyState icon={<Tag className="h-7 w-7" />} title={t('discNoOverrides')} />
      ) : (
        <div className="mb-4 space-y-2">
          {overrides.map((rule) => (
            <div key={rule.id} className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-electric-500/20">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${rule.type === 'customer' ? 'bg-aura-500/10 text-aura-400' : 'bg-electric-500/10 text-electric-400'}`}>
                {rule.type === 'customer' ? <Tag className="h-4 w-4" /> : <FileDown className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{rule.targetName}</p>
                <p className="text-xs text-slate-500">{rule.type === 'customer' ? t('discPerCustomer') : t('discPerFile')}</p>
              </div>
              <span className="rounded-lg bg-success-500/10 px-3 py-1 text-sm font-bold text-success-400">{rule.percentage}%</span>
              <button onClick={() => removeRule(rule.id)} className="rounded-lg p-2 text-slate-600 opacity-0 transition-all hover:bg-danger-500/10 hover:text-danger-400 group-hover:opacity-100">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Price list items */}
      <h3 className="mb-2 section-title text-sm">{t('discPriceList')} · {t('discProducts')}</h3>
      {priceItems.length === 0 ? (
        <EmptyState icon={<Percent className="h-7 w-7" />} title={t('discNoProducts')} />
      ) : (
        <div className="mb-4 space-y-2">
          {priceItems.map((item) => {
            const pct = getDiscountForItem(item);
            const finalPrice = item.originalPrice - (item.originalPrice * pct) / 100;
            const discAmount = item.originalPrice * pct / 100;
            return (
              <div key={item.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.productName}</p>
                    <p className="text-xs text-slate-500">{item.productCode} · {item.unit}</p>
                  </div>
                  <span className="chip !py-0.5 border-success-500/20 bg-success-500/5 text-success-300">{pct}%</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-white/[0.03] py-1.5">
                    <p className="text-[10px] text-slate-500">{t('discOriginal')}</p>
                    <p className="text-xs font-medium text-slate-300">{formatCurrency(item.originalPrice, lang)}</p>
                  </div>
                  <div className="rounded-lg bg-danger-500/5 py-1.5">
                    <p className="text-[10px] text-slate-500">{t('discDiscount')}</p>
                    <p className="text-xs font-medium text-danger-400">−{formatCurrency(discAmount, lang)}</p>
                  </div>
                  <div className="rounded-lg bg-success-500/10 py-1.5">
                    <p className="text-[10px] text-slate-500">{t('discFinal')}</p>
                    <p className="text-xs font-bold text-success-400">{formatCurrency(finalPrice, lang)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Generate discounted copy */}
      <button onClick={() => setExportConfirm(true)} disabled={priceItems.length === 0} className="btn-glow w-full">
        <FileDown className="h-4 w-4" />
        {t('discGenerateCopy')}
      </button>

      {discounted.length > 0 && (
        <div className="mt-4 rounded-2xl border border-success-500/20 bg-success-500/5 p-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success-400" />
            <span className="text-xs font-medium text-success-400">{discounted.length} {t('discProducts')}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{t('discAmount')}: {formatCurrency(totalSaved, lang)}</p>
        </div>
      )}

      <Modal open={overrideOpen} onClose={() => setOverrideOpen(false)} title={t('discAddOverride')}
        footer={<><button onClick={() => setOverrideOpen(false)} className="btn-ghost flex-1">{t('cancel')}</button><button onClick={addOverride} className="btn-glow flex-1">{t('save')}</button></>}
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('discApplyTo')}</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setForm({ ...form, type: 'customer' })} className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${form.type === 'customer' ? 'border-aura-500/40 bg-aura-500/10 text-aura-300' : 'border-white/10 text-slate-400'}`}>{t('discPerCustomer')}</button>
              <button onClick={() => setForm({ ...form, type: 'file' })} className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${form.type === 'file' ? 'border-electric-500/40 bg-electric-500/10 text-electric-300' : 'border-white/10 text-slate-400'}`}>{t('discPerFile')}</button>
            </div>
          </div>
          <div>
            <label className="label">{form.type === 'customer' ? t('customer') : t('kbFile')}</label>
            <input value={form.targetName} onChange={(e) => setForm({ ...form, targetName: e.target.value })} className="input-field" autoFocus />
          </div>
          <div>
            <label className="label">{t('discPercentage')}</label>
            <input type="number" min="0" max="100" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} className="input-field" placeholder="0" />
          </div>
        </div>
      </Modal>

      <Modal open={exportConfirm} onClose={() => setExportConfirm(false)} title={t('discConfirmExport')}
        footer={<><button onClick={() => setExportConfirm(false)} className="btn-ghost flex-1">{t('cancel')}</button><button onClick={generateDiscounted} className="btn-glow flex-1">{t('confirm')}</button></>}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-success-500/20 bg-success-500/5 p-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-400" />
            <p className="text-xs text-slate-400">{t('discConfirmExportDesc')}</p>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-warning-500/20 bg-warning-500/5 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-400" />
            <p className="text-xs text-slate-400">{t('discNeverModify')}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
