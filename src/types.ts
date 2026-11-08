export type ViewId =
  | 'home'
  | 'chat'
  | 'voice'
  | 'tasks'
  | 'calendar'
  | 'finance'
  | 'business'
  | 'invoices'
  | 'translate'
  | 'studio'
  | 'audio'
  | 'files'
  | 'knowledge'
  | 'discount'
  | 'videostudio'
  | 'marketing'
  | 'brand'
  | 'providers'
  | 'settings';

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  priority: Priority;
  dueDate?: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  source: string;
  date: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  title: string;
  with: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  dealValue: number;
  status: 'active' | 'lead' | 'inactive';
  notes?: string;
  discountOverride?: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  price: number;
}

export interface Invoice {
  id: string;
  number: string;
  type: 'invoice' | 'quotation';
  customer: string;
  date: string;
  dueDate?: string;
  items: InvoiceItem[];
  status: 'draft' | 'sent' | 'paid' | 'unpaid' | 'overdue';
}

export interface VoiceRecording {
  id: string;
  name: string;
  duration: number;
  date: number;
  size: number;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'other';
  size: number;
  modified: number;
}

// ===== Knowledge Base =====

export interface KbDocument {
  id: string;
  name: string;
  originalName: string;
  fileType: 'pdf' | 'excel' | 'word' | 'image' | 'text';
  category: string;
  supplier: string;
  size: number;
  uploadedAt: number;
  indexed: boolean;
  extractedText?: string;
  thumbnail?: string;
}

export interface KbFolder {
  id: string;
  name: string;
  type: 'category' | 'supplier';
  documentCount: number;
}

// ===== Smart Discount System =====

export interface DiscountRule {
  id: string;
  name: string;
  type: 'default' | 'file' | 'customer';
  targetId?: string;
  targetName?: string;
  percentage: number;
  createdAt: number;
}

export interface PriceListItem {
  id: string;
  documentId: string;
  productCode: string;
  productName: string;
  originalPrice: number;
  category: string;
  unit: string;
}

export interface DiscountedItem {
  id: string;
  sourceItemId: string;
  productName: string;
  productCode: string;
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
  sourceDocument: string;
  customer?: string;
  createdAt: number;
}

// ===== AI Video Studio =====

export interface VideoProject {
  id: string;
  name: string;
  format: '9:16' | '1:1' | '16:9';
  status: 'draft' | 'configured' | 'generating' | 'ready';
  scenes: VideoScene[];
  voiceover: {
    language: 'ar' | 'tr' | 'en' | 'fr';
    gender: 'male' | 'female';
    text: string;
  };
  backgroundMusic: boolean;
  subtitles: boolean;
  branding: boolean;
  createdAt: number;
}

export interface VideoScene {
  id: string;
  order: number;
  imageId?: string;
  imageName?: string;
  duration: number;
  transition: 'fade' | 'slide' | 'zoom';
}

// ===== Social Media Marketing Studio =====

export interface MarketingCampaign {
  id: string;
  name: string;
  platform: 'instagram_post' | 'instagram_story' | 'instagram_reel' | 'facebook_post' | 'carousel';
  language: 'ar' | 'tr' | 'en' | 'fr';
  status: 'draft' | 'ready';
  productIds: string[];
  caption: string;
  hashtags: string[];
  callToAction: string;
  template: string;
  createdAt: number;
}

// ===== Brand Management =====

export interface BrandSettings {
  companyName: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  address: string;
}

// ===== Audio Studio =====

export interface AudioProject {
  id: string;
  name: string;
  voiceLanguage: 'ar' | 'tr' | 'en' | 'fr';
  voiceGender: 'male' | 'female';
  text: string;
  status: 'draft' | 'ready';
  duration: number;
  createdAt: number;
}

// ===== AI Provider System =====

export type AIProvider = 'gemini' | 'groq' | 'openrouter';

export interface ProviderModel {
  id: string;
  label: string;
  free: boolean;
  contextWindow?: string;
}

export interface ProviderDef {
  id: AIProvider;
  label: string;
  description: string;
  models: ProviderModel[];
  secretKey: string;
  docsUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: number;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ProviderSettings {
  activeProvider: AIProvider;
  activeModel: string;
  configured: Record<AIProvider, boolean>;
}
