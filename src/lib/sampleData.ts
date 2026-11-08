import type { Task, Transaction, Appointment, Customer, Invoice, FileItem, VoiceRecording } from '../types';

export const sampleTasks: Task[] = [
  { id: 't1', title: 'اجتماع مع فريق التسويق', description: 'مراجعة خطة الربع الأخير', done: false, priority: 'high', dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), createdAt: Date.now() - 3600000 },
  { id: 't2', title: 'إعداد عرض سعر للعميل', done: false, priority: 'medium', dueDate: new Date(Date.now() + 172800000).toISOString().slice(0, 10), createdAt: Date.now() - 7200000 },
  { id: 't3', title: 'متابعة الدفعات المتأخرة', done: true, priority: 'high', dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10), createdAt: Date.now() - 200000000 },
  { id: 't4', title: 'تحديث الملف التعريفي', done: false, priority: 'low', dueDate: new Date(Date.now() + 604800000).toISOString().slice(0, 10), createdAt: Date.now() - 100000000 },
];

export const sampleTransactions: Transaction[] = [
  { id: 'tx1', type: 'income', amount: 5200, category: 'استشارات', source: 'عميل - شركة النور', date: new Date(Date.now() - 86400000).toISOString().slice(0, 10) },
  { id: 'tx2', type: 'expense', amount: 850, category: 'إيجار', source: 'مكتب العمل', date: new Date(Date.now() - 172800000).toISOString().slice(0, 10) },
  { id: 'tx3', type: 'income', amount: 3100, category: 'خدمات', source: 'مشروع تصميم', date: new Date(Date.now() - 259200000).toISOString().slice(0, 10) },
  { id: 'tx4', type: 'expense', amount: 420, category: 'اشتراكات', source: 'أدوات التصميم', date: new Date(Date.now() - 432000000).toISOString().slice(0, 10) },
  { id: 'tx5', type: 'expense', amount: 180, category: 'مواصلات', source: 'تنقلات', date: new Date().toISOString().slice(0, 10) },
  { id: 'tx6', type: 'income', amount: 1750, category: 'استشارات', source: 'عميل - متجر الأفق', date: new Date().toISOString().slice(0, 10) },
];

export const sampleAppointments: Appointment[] = [
  { id: 'a1', title: 'اجتماع متابعة مشروع', with: 'شركة النور', date: new Date().toISOString().slice(0, 10), time: '11:00', location: 'المكتب' },
  { id: 'a2', title: 'عرض منتج جديد', with: 'متجر الأفق', date: new Date().toISOString().slice(0, 10), time: '15:30', location: 'عن بعد' },
  { id: 'a3', title: 'مراجعة عقد', with: 'مكتب المحاماة', date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), time: '10:00' },
  { id: 'a4', title: 'غداء عمل', with: 'أحمد خالد', date: new Date(Date.now() + 259200000).toISOString().slice(0, 10), time: '13:00', location: 'مطعم الواحة' },
];

export const sampleCustomers: Customer[] = [
  { id: 'c1', name: 'شركة النور', company: 'النور القابضة', phone: '+971 50 123 4567', email: 'info@alnoor.com', dealValue: 12000, status: 'active', notes: 'عميل مميز' },
  { id: 'c2', name: 'متجر الأفق', company: 'الأفق للتجزئة', phone: '+971 55 987 6543', email: 'sales@alofq.com', dealValue: 4800, status: 'active' },
  { id: 'c3', name: 'أحمد خالد', phone: '+971 52 444 1111', dealValue: 2200, status: 'lead' },
  { id: 'c4', name: 'مكتب المحاماة', company: 'العدالة', phone: '+971 54 333 2222', email: 'office@adala.com', dealValue: 7500, status: 'active' },
  { id: 'c5', name: 'سارة محمد', phone: '+971 56 777 8888', dealValue: 0, status: 'inactive' },
];

export const sampleInvoices: Invoice[] = [
  {
    id: 'i1', number: 'INV-2024-001', type: 'invoice', customer: 'شركة النور',
    date: new Date(Date.now() - 604800000).toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 604800000).toISOString().slice(0, 10),
    status: 'paid',
    items: [
      { id: 'it1', description: 'استشارة تقنية', qty: 10, price: 500 },
      { id: 'it2', description: 'تصميم واجهة', qty: 1, price: 2000 },
    ],
  },
  {
    id: 'i2', number: 'INV-2024-002', type: 'invoice', customer: 'متجر الأفق',
    date: new Date(Date.now() - 259200000).toISOString().slice(0, 10),
    status: 'unpaid',
    items: [{ id: 'it3', description: 'إدارة متجر إلكتروني', qty: 1, price: 4800 }],
  },
  {
    id: 'i3', number: 'QUO-2024-003', type: 'quotation', customer: 'مكتب المحاماة',
    date: new Date().toISOString().slice(0, 10),
    status: 'sent',
    items: [
      { id: 'it4', description: 'نظام إدارة مستندات', qty: 1, price: 5000 },
      { id: 'it5', description: 'تدريب الفريق', qty: 5, price: 300 },
    ],
  },
];

export const sampleFiles: FileItem[] = [
  { id: 'f1', name: 'عقد شركة النور.pdf', type: 'document', size: 245000, modified: Date.now() - 86400000 },
  { id: 'f2', name: 'عرض المتجر.pptx', type: 'document', size: 1800000, modified: Date.now() - 432000000 },
  { id: 'f3', name: 'شعار-المشروع.png', type: 'image', size: 520000, modified: Date.now() - 172800000 },
  { id: 'f4', name: 'تقرير-شهري.xlsx', type: 'document', size: 890000, modified: Date.now() - 259200000 },
  { id: 'f5', name: 'صورة-منتج.jpg', type: 'image', size: 1200000, modified: Date.now() - 3600000 },
  { id: 'f6', name: 'نسخة-احتياطية.zip', type: 'other', size: 5600000, modified: Date.now() - 604800000 },
];

export const sampleRecordings: VoiceRecording[] = [
  { id: 'r1', name: 'ملاحظة اجتماع', duration: 45, date: Date.now() - 86400000, size: 360000 },
  { id: 'r2', name: 'تذكير صوتي', duration: 18, date: Date.now() - 172800000, size: 144000 },
];
