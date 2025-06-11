import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';
import { Lock, User, Eye, EyeOff, Shield, Globe } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { language, setLanguage, direction, textAlign } = useLanguage();
  const { t } = useTranslation(language);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (!success) {
        setError(language === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Benutzername oder Passwort ist falsch');
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول' : 'Fehler beim Anmelden');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center p-4" dir={direction}>
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="px-8 py-12">
            {/* Language Switcher */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('ar')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    language === 'ar' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="text-lg">🇸🇦</span>
                  العربية
                </button>
                <button
                  onClick={() => setLanguage('de')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    language === 'de' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="text-lg">🇩🇪</span>
                  Deutsch
                </button>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
                <Shield size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2" style={{ textAlign }}>
                {language === 'ar' ? 'مدير المهام' : 'Task Manager'}
              </h1>
              <p className="text-gray-400" style={{ textAlign }}>
                {language === 'ar' ? 'نظام إدارة المهام والمشتركين' : 'Aufgaben- und Abonnentenverwaltungssystem'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                  {t('username')}
                </label>
                <div className="relative">
                  <User size={20} className={`absolute ${direction === 'rtl' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full ${direction === 'rtl' ? 'pl-10 pr-4' : 'pr-10 pl-4'} py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                    placeholder={language === 'ar' ? 'أدخل اسم المستخدم' : 'Benutzername eingeben'}
                    style={{ textAlign }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                  {language === 'ar' ? 'كلمة المرور' : 'Passwort'}
                </label>
                <div className="relative">
                  <Lock size={20} className={`absolute ${direction === 'rtl' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full ${direction === 'rtl' ? 'pl-10 pr-12' : 'pr-10 pl-12'} py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                    placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Passwort eingeben'}
                    style={{ textAlign }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm text-center" style={{ textAlign }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                    {language === 'ar' ? 'جاري تسجيل الدخول...' : 'Anmelden...'}
                  </div>
                ) : (
                  language === 'ar' ? 'تسجيل الدخول' : 'Anmelden'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm text-center mb-2" style={{ textAlign }}>
                  {language === 'ar' ? 'بيانات تجريبية:' : 'Testdaten:'}
                </p>
                <p className="text-gray-300 text-sm text-center" style={{ textAlign }}>
                  {language === 'ar' ? 'المستخدم:' : 'Benutzer:'} <span className="font-mono bg-gray-600 px-2 py-1 rounded">admin</span>
                </p>
                <p className="text-gray-300 text-sm text-center mt-1" style={{ textAlign }}>
                  {language === 'ar' ? 'كلمة المرور:' : 'Passwort:'} <span className="font-mono bg-gray-600 px-2 py-1 rounded">admin123</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
