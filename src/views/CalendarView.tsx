import { useState } from 'react';
import { Plus, Clock, MapPin, ChevronLeft, ChevronRight, Calendar as CalIconLib } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { loadJSON, saveJSON, uid, todayISO, isSameDay, formatDateLabel } from '../lib/storage';
import { sampleAppointments } from '../lib/sampleData';
import type { Appointment } from '../types';
import { Calendar as CalIcon } from 'lucide-react';

const KEY = 'mah-ai-appointments';

export function CalendarView({ onBack }: { onBack: () => void }) {
  const { t, lang, dir } = useI18n();
  const [appts, setAppts] = useState<Appointment[]>(() => loadJSON(KEY, sampleAppointments));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [form, setForm] = useState({ title: '', with: '', time: '', location: '' });

  const persist = (next: Appointment[]) => {
    setAppts(next);
    saveJSON(KEY, next);
  };

  const addAppt = () => {
    if (!form.title.trim()) return;
    const appt: Appointment = {
      id: uid(),
      title: form.title.trim(),
      with: form.with,
      date: selectedDate,
      time: form.time || '09:00',
      location: form.location || undefined,
    };
    persist([...appts, appt]);
    setForm({ title: '', with: '', time: '', location: '' });
    setModalOpen(false);
  };

  const removeAppt = (id: string) => persist(appts.filter((a) => a.id !== id));

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const monthNames = [
    t('january'), t('february'), t('march'), t('april'), t('may'), t('june'),
    t('july'), t('august'), t('september'), t('october'), t('november'), t('december'),
  ];
  const dayNames = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad to grid of 6 rows
  while (cells.length % 7 !== 0) cells.push(null);

  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const changeMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  const dayAppts = appts
    .filter((a) => isSameDay(a.date, selectedDate))
    .sort((a, b) => a.time.localeCompare(b.time));

  const dateISO = (day: number) =>
    new Date(viewYear, viewMonth, day).toISOString().slice(0, 10);

  const hasAppt = (day: number) =>
    appts.some((a) => isSameDay(a.date, dateISO(day)));

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title={t('secCalendar')}
        subtitle={t('secCalendarDesc')}
        icon={CalIcon}
        onBack={onBack}
        action={
          <button onClick={() => setModalOpen(true)} className="btn-glow !px-3 !py-2 text-xs">
            <Plus className="h-4 w-4" />
            {t('add')}
          </button>
        }
      />

      {/* Calendar */}
      <div className="card-surface mb-4 p-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => changeMonth(-1)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
            <PrevIcon className="h-5 w-5" />
          </button>
          <p className="text-sm font-semibold text-white">{monthNames[viewMonth]} {viewYear}</p>
          <button onClick={() => changeMonth(1)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
            <NextIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {dayNames.map((d) => (
            <div key={d} className="pb-1 text-[10px] font-semibold text-slate-500">{d}</div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const iso = dateISO(day);
            const isToday = iso === todayISO();
            const isSelected = iso === selectedDate;
            const hasEvent = hasAppt(day);
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(iso)}
                className={`relative flex h-9 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-electric-500/20 text-electric-300 shadow-glow-sm'
                    : isToday
                    ? 'bg-white/[0.05] text-white'
                    : 'text-slate-400 hover:bg-white/[0.03]'
                }`}
              >
                {day}
                {hasEvent && (
                  <span className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? 'bg-electric-400' : 'bg-aura-400'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day appointments */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="section-title text-sm">{formatDateLabel(selectedDate, lang)}</h3>
        <span className="chip">{dayAppts.length}</span>
      </div>

      {dayAppts.length === 0 ? (
        <EmptyState icon={<CalIconLib className="h-7 w-7" />} title={t('noAppointments')} />
      ) : (
        <div className="space-y-2">
          {dayAppts.map((a) => (
            <div
              key={a.id}
              className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-electric-500/20"
            >
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-electric-500/10 text-electric-400">
                <Clock className="h-4 w-4" />
                <span className="mt-0.5 text-[10px] font-mono">{a.time}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{a.title}</p>
                <p className="truncate text-xs text-slate-400">{a.with}</p>
                {a.location && (
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="h-3 w-3" /> {a.location}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeAppt(a.id)}
                className="rounded-lg p-2 text-slate-600 opacity-0 transition-all hover:bg-danger-500/10 hover:text-danger-400 group-hover:opacity-100"
              >
                <Plus className="h-4 w-4 rotate-45" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('addAppointment')}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">{t('cancel')}</button>
            <button onClick={addAppt} className="btn-glow flex-1">{t('save')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('title')}</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" autoFocus />
          </div>
          <div>
            <label className="label">{t('appointmentWith')}</label>
            <input value={form.with} onChange={(e) => setForm({ ...form, with: e.target.value })} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t('date')}</label>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">{t('time')}</label>
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">{t('location')}</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
