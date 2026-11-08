import type { ReactNode } from 'react';
import type { ViewId } from '../types';
import {
  MessageSquare, Mic, CheckSquare, Calendar, Wallet, Building2,
  FileText, Languages, Image, AudioLines, FolderOpen,
  BookOpen, Percent, Video, Megaphone, Palette, Cpu, Settings, type LucideIcon,
} from 'lucide-react';

export interface SectionMeta {
  id: ViewId;
  icon: LucideIcon;
  gradient: string;
  glow: string;
}

export const SECTION_META: Record<Exclude<ViewId, 'home'>, SectionMeta> = {
  chat: { id: 'chat', icon: MessageSquare, gradient: 'from-electric-600/20 to-electric-500/5', glow: 'shadow-glow-sm' },
  voice: { id: 'voice', icon: Mic, gradient: 'from-aura-500/20 to-aura-400/5', glow: 'shadow-[0_0_14px_-2px_rgba(124,92,240,0.35)]' },
  tasks: { id: 'tasks', icon: CheckSquare, gradient: 'from-success-500/20 to-success-400/5', glow: 'shadow-glow-success' },
  calendar: { id: 'calendar', icon: Calendar, gradient: 'from-electric-500/20 to-aura-400/5', glow: 'shadow-glow-sm' },
  finance: { id: 'finance', icon: Wallet, gradient: 'from-success-600/20 to-electric-500/5', glow: 'shadow-glow-success' },
  business: { id: 'business', icon: Building2, gradient: 'from-electric-600/20 to-aura-500/5', glow: 'shadow-glow-sm' },
  invoices: { id: 'invoices', icon: FileText, gradient: 'from-warning-500/20 to-electric-500/5', glow: 'shadow-[0_0_14px_-2px_rgba(245,180,35,0.3)]' },
  translate: { id: 'translate', icon: Languages, gradient: 'from-aura-500/20 to-electric-400/5', glow: 'shadow-glow-aura' },
  studio: { id: 'studio', icon: Image, gradient: 'from-aura-400/20 to-electric-500/5', glow: 'shadow-glow-aura' },
  audio: { id: 'audio', icon: AudioLines, gradient: 'from-electric-500/20 to-aura-500/5', glow: 'shadow-glow-sm' },
  files: { id: 'files', icon: FolderOpen, gradient: 'from-electric-600/20 to-success-500/5', glow: 'shadow-glow-sm' },
  knowledge: { id: 'knowledge', icon: BookOpen, gradient: 'from-electric-600/20 to-aura-500/5', glow: 'shadow-glow-sm' },
  discount: { id: 'discount', icon: Percent, gradient: 'from-success-500/20 to-warning-500/5', glow: 'shadow-glow-success' },
  videostudio: { id: 'videostudio', icon: Video, gradient: 'from-aura-500/20 to-electric-500/5', glow: 'shadow-glow-aura' },
  marketing: { id: 'marketing', icon: Megaphone, gradient: 'from-aura-400/20 to-warning-500/5', glow: 'shadow-glow-aura' },
  brand: { id: 'brand', icon: Palette, gradient: 'from-electric-500/20 to-aura-500/5', glow: 'shadow-glow-sm' },
  providers: { id: 'providers', icon: Cpu, gradient: 'from-electric-600/20 to-aura-500/5', glow: 'shadow-glow-sm' },
  settings: { id: 'settings', icon: Settings, gradient: 'from-ink-700/20 to-electric-500/5', glow: 'shadow-glow-sm' },
};

// Primary navigation sections shown on the home grid
export const SECTION_ORDER: Exclude<ViewId, 'home'>[] = [
  'chat', 'voice', 'tasks', 'calendar', 'finance', 'business',
  'invoices', 'translate', 'studio', 'audio', 'files',
  'knowledge', 'discount', 'videostudio', 'marketing', 'brand',
];

// New premium sections (shown in a separate "Smart Tools" group)
export const SMART_TOOL_SECTIONS: Exclude<ViewId, 'home'>[] = [
  'knowledge', 'discount', 'videostudio', 'marketing', 'brand',
];

export interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = '', glow = false }: CardProps) {
  return (
    <div className={`card-surface ${glow ? 'glow-border' : ''} ${className}`}>
      {children}
    </div>
  );
}
