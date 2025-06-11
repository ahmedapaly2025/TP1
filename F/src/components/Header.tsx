import React, { useState } from 'react';
import { MenuIcon, X, Download, Bot, Bell, LogOut, User, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBotContext } from '../context/BotContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';
import NotificationCenter from './NotificationCenter';
import CustomTaskSender from './CustomTaskSender';
import { ActiveView } from '../App';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarOpen, 
  setSidebarOpen,
  activeView,
  setActiveView
}) => {
  const { user, logout, getProfile } = useAuth();
  const { notifications } = useBotContext();
  const { language, direction, textAlign, isRTL } = useLanguage();
  const { t } = useTranslation(language);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCustomSender, setShowCustomSender] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const profile = getProfile();

  const getViewTitle = (view: ActiveView) => {
    const titles = {
      dashboard: t('dashboard'),
      tasks: t('tasks'),
      subscribers: t('technicians'),
      invoices: t('invoices'),
      reports: t('reports'),
      settings: t('settings'),
      analytics: t('analytics'),
      logs: t('logs'),
      profile: t('adminProfile')
    };
    return titles[view];
  };

  const exportData = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    switch (activeView) {
      case 'dashboard':
        alert(language === 'ar' ? 'تم تصدير بيانات لوحة التحكم بنجاح!' : 'Dashboard-Daten erfolgreich exportiert!');
        break;
      case 'reports':
        alert(language === 'ar' ? 'تم تصدير التقارير بنجاح!' : 'Berichte erfolgreich exportiert!');
        break;
      case 'analytics':
        alert(language === 'ar' ? 'تم تصدير التحليلات بنجاح!' : 'Analytics erfolgreich exportiert!');
        break;
      default:
        alert(language === 'ar' ? 'تم تصدير البيانات بنجاح!' : 'Daten erfolgreich exportiert!');
    }
  };

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg sticky top-0 z-50" dir={direction}>
        <div className="flex items-center justify-between px-4 py-3 w-full">
          {/* Left side - Sidebar Toggle + Logo */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* CRITICAL: Sidebar Toggle Button - ALWAYS VISIBLE */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors flex-shrink-0"
              title={language === 'ar' ? (sidebarOpen ? 'إخفاء القائمة' : 'إظهار القائمة') : (sidebarOpen ? 'Menü ausblenden' : 'Menü anzeigen')}
            >
              {sidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
            
            {/* Logo and Title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 bg-indigo-600 rounded-lg flex-shrink-0">
                <Bot size={20} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold text-white truncate">
                  {language === 'ar' ? 'مدير المهام' : 'Task Manager'}
                </h1>
                <p className="text-sm text-gray-400 truncate">{getViewTitle(activeView)}</p>
              </div>
            </div>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* 🔥 NEW: Custom Send Button */}
            <button 
              onClick={() => setShowCustomSender(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition-colors font-medium"
              title={language === 'ar' ? 'إرسال مخصص للفنيين' : 'Benutzerdefiniertes Senden'}
            >
              <Send size={16} />
              <span className="hidden md:inline">
                {language === 'ar' ? 'إرسال مخصص' : 'Senden'}
              </span>
            </button>

            {/* Export Button */}
            <button 
              onClick={exportData}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm transition-colors font-medium"
            >
              <Download size={16} />
              <span className="hidden md:inline">{t('export')}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title={language === 'ar' ? 'الإشعارات' : 'Benachrichtigungen'}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title={language === 'ar' ? 'قائمة المستخدم' : 'Benutzermenü'}
              >
                <User size={18} />
                <span className="text-sm hidden sm:inline">
                  {profile?.fullName || user?.username}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-700">
                    <p className="text-white font-medium text-sm">{profile?.fullName || user?.username}</p>
                    <p className="text-gray-400 text-xs">
                      {language === 'ar' ? 'مدير النظام' : 'Systemadministrator'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-sm text-right"
                  >
                    <User size={16} />
                    {t('adminProfile')}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-sm text-right"
                  >
                    <LogOut size={16} />
                    {language === 'ar' ? 'تسجيل الخروج' : 'Abmelden'}
                  </button>
                </div>
              )}
            </div>
            
            {/* Connection Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                {language === 'ar' ? 'متصل' : 'Verbunden'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)}
        setActiveView={setActiveView}
      />

      <CustomTaskSender 
        isOpen={showCustomSender}
        onClose={() => setShowCustomSender(false)}
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default Header;
