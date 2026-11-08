import { useState } from 'react';
import { Plus, Check, Trash2, Flag, CheckSquare, Calendar as CalIcon } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { loadJSON, saveJSON, uid, formatDateLabel } from '../lib/storage';
import { sampleTasks } from '../lib/sampleData';
import type { Task, Priority } from '../types';
import { CheckSquare as TaskIcon } from 'lucide-react';

const KEY = 'mah-ai-tasks';

export function TasksView({ onBack }: { onBack: () => void }) {
  const { t, lang } = useI18n();
  const [tasks, setTasks] = useState<Task[]>(() => loadJSON(KEY, sampleTasks));
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  const persist = (next: Task[]) => {
    setTasks(next);
    saveJSON(KEY, next);
  };

  const addTask = () => {
    if (!title.trim()) return;
    const task: Task = {
      id: uid(),
      title: title.trim(),
      priority,
      dueDate: dueDate || undefined,
      done: false,
      createdAt: Date.now(),
    };
    persist([task, ...tasks]);
    setTitle('');
    setPriority('medium');
    setDueDate('');
    setModalOpen(false);
  };

  const toggleDone = (id: string) => {
    persist(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const remove = (id: string) => {
    persist(tasks.filter((t) => t.id !== id));
  };

  const active = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  const priorityColor: Record<Priority, string> = {
    high: 'text-danger-400 bg-danger-500/10 border-danger-500/20',
    medium: 'text-warning-400 bg-warning-500/10 border-warning-500/20',
    low: 'text-electric-400 bg-electric-500/10 border-electric-500/20',
  };

  const TaskRow = ({ task }: { task: Task }) => (
    <div
      className={`group flex items-center gap-3 rounded-2xl border p-3 transition-all ${
        task.done ? 'border-white/5 bg-white/[0.01] opacity-60' : 'border-white/5 bg-white/[0.02] hover:border-electric-500/20'
      }`}
    >
      <button
        onClick={() => toggleDone(task.id)}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all ${
          task.done
            ? 'border-success-500 bg-success-500/20 text-success-400'
            : 'border-white/15 text-transparent hover:border-electric-500/50'
        }`}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </button>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${task.done ? 'text-slate-500 line-through' : 'text-white'}`}>
          {task.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className={`chip !py-0.5 ${priorityColor[task.priority]}`}>
            <Flag className="h-2.5 w-2.5" />
            {t(task.priority)}
          </span>
          {task.dueDate && (
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <CalIcon className="h-3 w-3" />
              {formatDateLabel(task.dueDate, lang)}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => remove(task.id)}
        className="rounded-xl p-2 text-slate-600 opacity-0 transition-all hover:bg-danger-500/10 hover:text-danger-400 group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title={t('secTasks')}
        subtitle={t('secTasksDesc')}
        icon={TaskIcon}
        onBack={onBack}
        action={
          <button onClick={() => setModalOpen(true)} className="btn-glow !px-3 !py-2 text-xs">
            <Plus className="h-4 w-4" />
            {t('add')}
          </button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="card-surface p-4">
          <p className="text-xs text-slate-400">{t('activeTasks')}</p>
          <p className="mt-1 text-2xl font-bold text-white">{active.length}</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs text-slate-400">{t('doneTasks')}</p>
          <p className="mt-1 text-2xl font-bold text-success-400">{done.length}</p>
        </div>
      </div>

      {active.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{t('pending')}</h3>
          <div className="space-y-2">
            {active.map((task) => <TaskRow key={task.id} task={task} />)}
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{t('completed')}</h3>
          <div className="space-y-2">
            {done.map((task) => <TaskRow key={task.id} task={task} />)}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <EmptyState icon={<CheckSquare className="h-7 w-7" />} title={t('noTasks')} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('addTask')}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">{t('cancel')}</button>
            <button onClick={addTask} className="btn-glow flex-1">{t('save')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('taskTitle')}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder={t('taskTitle')}
              autoFocus
            />
          </div>
          <div>
            <label className="label">{t('priority')}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                    priority === p ? priorityColor[p] : 'border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {t(p)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">{t('dueDate')}</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
