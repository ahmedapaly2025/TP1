import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  direction: 'rtl' | 'ltr';
  textAlign: 'right' | 'left';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('taskManager_language');
    return (saved as Language) || 'ar';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const textAlign = language === 'ar' ? 'right' : 'left';
  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('taskManager_language', language);
    
    // Apply direction to HTML
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    
    // Apply language to body
    document.body.className = `${direction} ${language}`;
    
    // Update CSS variables for direction
    document.documentElement.style.setProperty('--text-align', textAlign);
    document.documentElement.style.setProperty('--direction', direction);
    
    // Add CSS classes for direction
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }

    // Dispatch language change event
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language, direction, textAlign, isRTL }
    }));
  }, [language, direction, textAlign, isRTL]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    
    // Notify about language change
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: newLanguage, direction: newLanguage === 'ar' ? 'rtl' : 'ltr' }
    }));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, direction, textAlign, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
