import { useState } from 'react';
import { Building2, Phone, Mail, Globe, Instagram, Facebook, MessageCircle, MapPin, Upload, Check, Info } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SectionHeader } from '../components/SectionHeader';
import { loadJSON, saveJSON } from '../lib/storage';
import type { BrandSettings } from '../types';
import { Palette as BrandIcon } from 'lucide-react';

const KEY = 'smart-me-brand-settings';

const defaultBrand: BrandSettings = {
  companyName: 'شركتي',
  primaryColor: '#1f7fff',
  secondaryColor: '#7c5cf0',
  phone: '+971 50 000 0000',
  email: 'info@mycompany.com',
  website: 'www.mycompany.com',
  instagram: '@mycompany',
  facebook: 'mycompany',
  whatsapp: '+971500000000',
  address: 'الإمارات العربية المتحدة',
};

export function BrandView({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [brand, setBrand] = useState<BrandSettings>(() => loadJSON(KEY, defaultBrand));
  const [saved, setSaved] = useState(false);

  const update = (field: keyof BrandSettings, value: string) => {
    setBrand({ ...brand, [field]: value });
    setSaved(false);
  };

  const save = () => {
    saveJSON(KEY, brand);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <SectionHeader title={t('secBrand')} subtitle={t('secBrandDesc')} icon={BrandIcon} onBack={onBack} />

      {/* Brand preview card */}
      <div className="relative mb-4 overflow-hidden rounded-3xl border border-white/5 p-5" style={{ background: `linear-gradient(135deg, ${brand.primaryColor}15, ${brand.secondaryColor}10)` }}>
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 text-2xl font-bold text-white" style={{ background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor})` }}>
            {brand.companyName.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-bold text-white">{brand.companyName}</p>
            <p className="text-xs text-slate-400">{brand.website}</p>
          </div>
        </div>
      </div>

      {/* Logo upload */}
      <div className="card-surface mb-4 p-4">
        <label className="label">{t('brandLogo')}</label>
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-electric-500/30 bg-electric-500/5 py-6 text-sm font-medium text-electric-400 transition-all hover:border-electric-500/50">
          <Upload className="h-5 w-5" />{t('brandUploadLogo')}
        </button>
      </div>

      {/* Company name */}
      <div className="card-surface mb-4 p-4">
        <label className="label flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-electric-400" />{t('brandCompany')}</label>
        <input value={brand.companyName} onChange={(e) => update('companyName', e.target.value)} className="input-field" />
      </div>

      {/* Brand colors */}
      <div className="card-surface mb-4 p-4">
        <p className="mb-3 text-sm font-medium text-white">{t('brandColors')}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">{t('brandPrimary')}</label>
            <div className="flex items-center gap-2">
              <input type="color" value={brand.primaryColor} onChange={(e) => update('primaryColor', e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
              <input value={brand.primaryColor} onChange={(e) => update('primaryColor', e.target.value)} className="input-field flex-1 !py-2 font-mono text-xs" dir="ltr" />
            </div>
          </div>
          <div>
            <label className="label">{t('brandSecondary')}</label>
            <div className="flex items-center gap-2">
              <input type="color" value={brand.secondaryColor} onChange={(e) => update('secondaryColor', e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
              <input value={brand.secondaryColor} onChange={(e) => update('secondaryColor', e.target.value)} className="input-field flex-1 !py-2 font-mono text-xs" dir="ltr" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="card-surface mb-4 p-4">
        <p className="mb-3 text-sm font-medium text-white">{t('brandContact')}</p>
        <div className="space-y-3">
          <div>
            <label className="label flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-electric-400" />{t('brandPhone')}</label>
            <input value={brand.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" dir="ltr" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-electric-400" />{t('brandEmail')}</label>
            <input value={brand.email} onChange={(e) => update('email', e.target.value)} className="input-field" dir="ltr" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-electric-400" />{t('brandWebsite')}</label>
            <input value={brand.website} onChange={(e) => update('website', e.target.value)} className="input-field" dir="ltr" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-electric-400" />{t('brandAddress')}</label>
            <input value={brand.address} onChange={(e) => update('address', e.target.value)} className="input-field" />
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="card-surface mb-4 p-4">
        <p className="mb-3 text-sm font-medium text-white">{t('brandSocial')}</p>
        <div className="space-y-3">
          <div>
            <label className="label flex items-center gap-1.5"><Instagram className="h-3.5 w-3.5 text-aura-400" />{t('brandInstagram')}</label>
            <input value={brand.instagram} onChange={(e) => update('instagram', e.target.value)} className="input-field" dir="ltr" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Facebook className="h-3.5 w-3.5 text-electric-400" />{t('brandFacebook')}</label>
            <input value={brand.facebook} onChange={(e) => update('facebook', e.target.value)} className="input-field" dir="ltr" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5 text-success-400" />{t('brandWhatsapp')}</label>
            <input value={brand.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} className="input-field" dir="ltr" />
          </div>
        </div>
      </div>

      {/* Used in notice */}
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-electric-500/20 bg-electric-500/5 p-2.5">
        <Info className="h-4 w-4 shrink-0 text-electric-400" />
        <p className="text-xs text-slate-400">{t('brandUsedIn')}</p>
      </div>

      <button onClick={save} className="btn-glow w-full">
        {saved ? <><Check className="h-4 w-4" />{t('brandSaved')}</> : t('brandSave')}
      </button>
    </div>
  );
}
