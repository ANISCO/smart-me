import { useState } from 'react';
import { BookOpen, Upload, Search, FileText, FileSpreadsheet, File, Image as ImageIcon, Folder, Trash2, Info, CheckCircle2, Filter } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { loadJSON, saveJSON, uid, formatBytes, formatDateLabel } from '../lib/storage';
import type { KbDocument } from '../types';
import { BookOpen as KbIcon } from 'lucide-react';

const KEY = 'smart-me-kb-docs';

const sampleDocs: KbDocument[] = [
  { id: 'kb1', name: 'قائمة أسعار المورد الرئيسي.pdf', originalName: 'price-list-supplier.pdf', fileType: 'pdf', category: 'قوائم أسعار', supplier: 'المورد الرئيسي', size: 542000, uploadedAt: Date.now() - 86400000, indexed: true, extractedText: 'منتج أ - 100 ر.س\nمنتج ب - 250 ر.س\nمنتج ج - 180 ر.س' },
  { id: 'kb2', name: 'كتالوج المنتجات.xlsx', originalName: 'catalog.xlsx', fileType: 'excel', category: 'كتالوجات', supplier: 'المورد الرئيسي', size: 1200000, uploadedAt: Date.now() - 172800000, indexed: true, extractedText: 'كود المنتج | الاسم | السعر\nP001 | منتج أ | 100\nP002 | منتج ب | 250' },
  { id: 'kb3', name: 'عقد توريد.docx', originalName: 'supply-contract.docx', fileType: 'word', category: 'عقود', supplier: 'شركة التوريدات', size: 89000, uploadedAt: Date.now() - 259200000, indexed: true, extractedText: 'عقد توريد بين الطرفين...' },
  { id: 'kb4', name: 'صورة منتج جديد.jpg', originalName: 'product-photo.jpg', fileType: 'image', category: 'صور منتجات', supplier: 'المورد الرئيسي', size: 2400000, uploadedAt: Date.now() - 3600000, indexed: false },
  { id: 'kb5', name: 'ملاحظات.txt', originalName: 'notes.txt', fileType: 'text', category: 'ملاحظات', supplier: 'عام', size: 4200, uploadedAt: Date.now() - 7200000, indexed: true, extractedText: 'ملاحظات عامة حول المنتجات' },
];

const fileTypeIcon = (type: KbDocument['fileType']) => {
  switch (type) {
    case 'pdf': return <FileText className="h-5 w-5 text-danger-400" />;
    case 'excel': return <FileSpreadsheet className="h-5 w-5 text-success-400" />;
    case 'word': return <FileText className="h-5 w-5 text-electric-400" />;
    case 'image': return <ImageIcon className="h-5 w-5 text-aura-400" />;
    default: return <File className="h-5 w-5 text-slate-400" />;
  }
};

const fileTypeBg = (type: KbDocument['fileType']) => {
  switch (type) {
    case 'pdf': return 'bg-danger-500/10';
    case 'excel': return 'bg-success-500/10';
    case 'word': return 'bg-electric-500/10';
    case 'image': return 'bg-aura-500/10';
    default: return 'bg-white/[0.03]';
  }
};

export function KnowledgeView({ onBack }: { onBack: () => void }) {
  const { t, lang } = useI18n();
  const [docs, setDocs] = useState<KbDocument[]>(() => loadJSON(KEY, sampleDocs));
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewing, setViewing] = useState<KbDocument | null>(null);
  const [form, setForm] = useState({ name: '', category: '', supplier: '', fileType: 'pdf' as KbDocument['fileType'] });

  const persist = (next: KbDocument[]) => { setDocs(next); saveJSON(KEY, next); };

  const categories = ['all', ...Array.from(new Set(docs.map((d) => d.category)))];
  const suppliers = Array.from(new Set(docs.map((d) => d.supplier)));

  const filtered = docs.filter((d) => {
    if (filterCat !== 'all' && d.category !== filterCat) return false;
    if (search) {
      const q = search.toLowerCase();
      return d.name.toLowerCase().includes(q) || d.extractedText?.toLowerCase().includes(q) || d.supplier.toLowerCase().includes(q);
    }
    return true;
  });

  const addDoc = () => {
    if (!form.name.trim()) return;
    const doc: KbDocument = {
      id: uid(), name: form.name.trim(), originalName: form.name.trim(),
      fileType: form.fileType, category: form.category || 'عام', supplier: form.supplier || 'عام',
      size: 50000 + Math.floor(Math.random() * 500000), uploadedAt: Date.now(),
      indexed: true, extractedText: 'سيتم استخراج المحتوى عند تكامل مزود المعالجة.',
    };
    persist([doc, ...docs]);
    setForm({ name: '', category: '', supplier: '', fileType: 'pdf' });
    setUploadOpen(false);
  };

  const remove = (id: string) => persist(docs.filter((d) => d.id !== id));

  return (
    <div className="animate-fade-in">
      <SectionHeader title={t('secKnowledge')} subtitle={t('secKnowledgeDesc')} icon={KbIcon} onBack={onBack}
        action={<button onClick={() => setUploadOpen(true)} className="btn-glow !px-3 !py-2 text-xs"><Upload className="h-4 w-4" />{t('kbUpload')}</button>}
      />

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="card-surface p-3 text-center">
          <p className="text-lg font-bold text-white">{docs.length}</p>
          <p className="text-[10px] text-slate-400">{t('kbTotalDocs')}</p>
        </div>
        <div className="card-surface p-3 text-center">
          <p className="text-lg font-bold text-electric-400">{categories.length - 1}</p>
          <p className="text-[10px] text-slate-400">{t('kbTotalCategories')}</p>
        </div>
        <div className="card-surface p-3 text-center">
          <p className="text-lg font-bold text-aura-400">{suppliers.length}</p>
          <p className="text-[10px] text-slate-400">{t('kbTotalSuppliers')}</p>
        </div>
      </div>

      {/* Preserve original notice */}
      <div className="mb-3 flex items-center gap-2 rounded-2xl border border-success-500/20 bg-success-500/5 p-2.5">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-success-400" />
        <p className="text-xs text-slate-400">{t('kbPreserveOriginal')}</p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('kbSearch')} className="input-field !ps-10" />
      </div>

      {/* Category filters */}
      <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
              filterCat === cat ? 'border-electric-500/40 bg-electric-500/10 text-electric-300' : 'border-white/10 text-slate-400 hover:border-white/20'
            }`}>
            {cat === 'all' ? <Filter className="h-3 w-3" /> : <Folder className="h-3 w-3" />}
            {cat === 'all' ? t('kbAll') : cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-7 w-7" />} title={search ? t('kbNoResults') : t('kbNoDocs')} />
      ) : (
        <div className="space-y-2">
          {filtered.map((doc) => (
            <div key={doc.id} className="group rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-electric-500/20">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${fileTypeBg(doc.fileType)}`}>
                  {fileTypeIcon(doc.fileType)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{doc.name}</p>
                  <p className="text-xs text-slate-500">
                    {doc.supplier} · {formatBytes(doc.size)} · {formatDateLabel(new Date(doc.uploadedAt).toISOString(), lang)}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="chip !py-0.5 border-electric-500/20 bg-electric-500/5 text-electric-300">{doc.category}</span>
                    {doc.indexed ? (
                      <span className="flex items-center gap-1 text-[10px] text-success-400"><CheckCircle2 className="h-3 w-3" />{t('kbIndexed')}</span>
                    ) : (
                      <span className="text-[10px] text-warning-400">{t('kbPending')}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setViewing(doc)} className="rounded-lg p-2 text-slate-500 hover:bg-electric-500/10 hover:text-electric-400">
                    <FileText className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(doc.id)} className="rounded-lg p-2 text-slate-600 opacity-0 transition-all hover:bg-danger-500/10 hover:text-danger-400 group-hover:opacity-100">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title={t('kbUpload')}
        footer={<><button onClick={() => setUploadOpen(false)} className="btn-ghost flex-1">{t('cancel')}</button><button onClick={addDoc} className="btn-glow flex-1">{t('save')}</button></>}
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('kbFile')}</label>
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-electric-500/30 bg-electric-500/5 py-8">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-electric-400" />
                <p className="mt-2 text-xs text-slate-400">PDF · Excel · Word · Image · Text</p>
              </div>
            </div>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field mt-2" placeholder={t('kbFile')} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t('kbCategory')}</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label">{t('kbSupplier')}</label>
              <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">{t('status')}</label>
            <select value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value as KbDocument['fileType'] })} className="input-field">
              <option value="pdf">PDF</option><option value="excel">Excel</option><option value="word">Word</option><option value="image">Image</option><option value="text">Text</option>
            </select>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-aura-500/20 bg-aura-500/5 p-2.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-aura-400" />
            <p className="text-xs text-slate-400">{t('kbPreserveOriginal')}</p>
          </div>
        </div>
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name ?? ''}
        footer={<button onClick={() => setViewing(null)} className="btn-glow w-full">{t('close')}</button>}
      >
        {viewing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-500">{t('kbCategory')}: </span><span className="text-white">{viewing.category}</span></div>
              <div><span className="text-slate-500">{t('kbSupplier')}: </span><span className="text-white">{viewing.supplier}</span></div>
              <div><span className="text-slate-500">{t('fileSize')}: </span><span className="text-white">{formatBytes(viewing.size)}</span></div>
              <div><span className="text-slate-500">{t('status')}: </span><span className={viewing.indexed ? 'text-success-400' : 'text-warning-400'}>{viewing.indexed ? t('kbIndexed') : t('kbPending')}</span></div>
            </div>
            <div>
              <label className="label">{t('kbExtracted')}</label>
              <div className="rounded-2xl border border-white/5 bg-ink-950/50 p-3 text-xs text-slate-300" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                {viewing.extractedText || '—'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
