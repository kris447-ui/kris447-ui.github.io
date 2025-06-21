
import { useState } from 'react';
import { LoginSettings } from '@/types/app';

export const useLoginSettings = () => {
  const [loginSettings, setLoginSettings] = useState<LoginSettings>({
    title: 'Sistem Manajemen Data',
    subtitle: 'Login untuk mengakses sistem',
    logoUrl: '',
    backgroundColor: 'bg-gradient-to-br from-blue-600 to-purple-700',
    fontFamily: 'font-sans',
    fontSize: 'text-3xl',
    titleColor: 'text-white',
    subtitleColor: 'text-blue-100',
    alignment: 'center',
    fontWeight: 'font-bold',
    showLogo: false,
    logoSize: 'h-12 w-12',
    companyName: ''
  });

  const updateLoginSettings = (newSettings: Partial<LoginSettings>) => {
    setLoginSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    loginSettings,
    updateLoginSettings
  };
};
