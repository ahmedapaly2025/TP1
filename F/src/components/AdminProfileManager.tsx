import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Eye, 
  EyeOff, 
  Shield,
  AlertCircle,
  CheckCircle,
  Send
} from 'lucide-react';

const AdminProfileManager: React.FC = () => {
  const { getProfile, updateProfile, changePassword, requestPasswordReset } = useAuth();
  const { language, direction, textAlign } = useLanguage();
  const { t } = useTranslation(language);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'reset'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    username: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [resetForm, setResetForm] = useState({
    email: '',
  });

  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      setProfileForm({
        fullName: profile.fullName,
        email: profile.email,
        username: profile.username,
      });
      setResetForm({
        email: profile.email,
      });
    }
  }, [getProfile]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Validation
      if (!profileForm.fullName.trim()) {
        setMessage({ type: 'error', text: t('required') });
        return;
      }

      if (!validateEmail(profileForm.email)) {
        setMessage({ type: 'error', text: t('invalidEmail') });
        return;
      }

      if (!profileForm.username.trim()) {
        setMessage({ type: 'error', text: t('required') });
        return;
      }

      const success = await updateProfile(profileForm);
      
      if (success) {
        setMessage({ type: 'success', text: t('profileUpdated') });
      } else {
        setMessage({ type: 'error', text: t('error') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('error') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Validation
      if (!passwordForm.currentPassword) {
        setMessage({ type: 'error', text: t('required') });
        return;
      }

      if (!validatePassword(passwordForm.newPassword)) {
        setMessage({ type: 'error', text: t('passwordTooShort') });
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setMessage({ type: 'error', text: t('passwordMismatch') });
        return;
      }

      const success = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      if (success) {
        setMessage({ type: 'success', text: t('passwordChanged') });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setMessage({ type: 'error', text: t('error') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('error') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (!validateEmail(resetForm.email)) {
        setMessage({ type: 'error', text: t('invalidEmail') });
        return;
      }

      const success = await requestPasswordReset(resetForm.email);
      
      if (success) {
        setMessage({ type: 'success', text: t('resetEmailSent') });
      } else {
        setMessage({ type: 'error', text: t('error') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('error') });
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessage = () => {
    setTimeout(() => setMessage(null), 5000);
  };

  useEffect(() => {
    if (message) {
      clearMessage();
    }
  }, [message]);

  const tabs = [
    { id: 'profile', label: t('adminProfile'), icon: <User size={16} /> },
    { id: 'password', label: t('changePassword'), icon: <Lock size={16} /> },
    { id: 'reset', label: t('resetPassword'), icon: <Mail size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-900" dir={direction}>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div style={{ textAlign }}>
            <h2 className="text-2xl font-bold">{t('adminProfile')}</h2>
            <p className="text-gray-400">
              {language === 'ar' 
                ? 'إدارة بيانات الأدمن وكلمة المرور'
                : 'Admin-Daten und Passwort verwalten'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="text-indigo-400" size={24} />
            <span className="text-indigo-400 font-medium">
              {language === 'ar' ? 'أدمن' : 'Admin'}
            </span>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : message.type === 'error'
              ? 'bg-red-500/10 border-red-500/20 text-red-400'
              : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' && <CheckCircle size={16} />}
              {message.type === 'error' && <AlertCircle size={16} />}
              {message.type === 'info' && <AlertCircle size={16} />}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg border border-gray-700">
          {/* Tabs */}
          <div className="border-b border-gray-700">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-indigo-400 border-b-2 border-indigo-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                      <User size={16} className={`inline ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                      {t('fullName')}
                    </label>
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={language === 'ar' ? 'أدخل الاسم الكامل' : 'Vollständigen Namen eingeben'}
                      style={{ textAlign }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                      <Mail size={16} className={`inline ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'E-Mail eingeben'}
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                      <User size={16} className={`inline ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                      {t('username')}
                    </label>
                    <input
                      type="text"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={language === 'ar' ? 'أدخل اسم المستخدم' : 'Benutzername eingeben'}
                      style={{ textAlign }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 rounded-lg text-white transition-colors font-medium"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {t('updateProfile')}
                </button>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                      <Lock size={16} className={`inline ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                      {t('currentPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={language === 'ar' ? 'أدخل كلمة المرور الحالية' : 'Aktuelles Passwort eingeben'}
                        style={{ textAlign: 'left', direction: 'ltr' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                      <Lock size={16} className={`inline ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                      {t('newPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={language === 'ar' ? 'أدخل كلمة المرور الجديدة' : 'Neues Passwort eingeben'}
                        style={{ textAlign: 'left', direction: 'ltr' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                      <Lock size={16} className={`inline ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                      {t('confirmPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Passwort bestätigen'}
                        style={{ textAlign: 'left', direction: 'ltr' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 rounded-lg text-white transition-colors font-medium"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Lock size={16} />
                  )}
                  {t('changePassword')}
                </button>
              </form>
            )}

            {/* Reset Tab */}
            {activeTab === 'reset' && (
              <form onSubmit={handleRequestReset} className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-400 text-sm" style={{ textAlign }}>
                    {language === 'ar' 
                      ? 'سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
                      : 'Ein Link zum Zurücksetzen des Passworts wird an Ihre E-Mail gesendet'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                    <Mail size={16} className={`inline ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={resetForm.email}
                    onChange={(e) => setResetForm({...resetForm, email: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'E-Mail eingeben'}
                    style={{ textAlign: 'left', direction: 'ltr' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 rounded-lg text-white transition-colors font-medium"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {t('sendResetEmail')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileManager;
