import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  FileText, 
  BarChart3,
  Settings, 
  LogOut,
  Bot,
  Activity,
  FileSearch,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';
import { ActiveView } from '../App';

interface SidebarProps {
  open: boolean;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, activeView, setActiveView }) => {
  const { logout } = useAuth();
  const { language, direction, textAlign, isRTL } = useLanguage();
  const { t } = useTranslation(language);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: t('dashboard'), view: 'dashboard' as ActiveView },
    { icon: <CheckSquare size={20} />, label: t('tasks'), view: 'tasks' as ActiveView },
    { icon: <Users size={20} />, label: t('technicians'), view: 'subscribers' as ActiveView },
    { icon: <FileText size={20} />, label: t('invoices'), view: 'invoices' as ActiveView },
    { icon: <BarChart3 size={20} />, label: t('reports'), view: 'reports' as ActiveView },
    { icon: <Activity size={20} />, label: t('analytics'), view: 'analytics' as ActiveView },
    { icon: <FileSearch size={20} />, label: t('logs'), view: 'logs' as ActiveView },
  ];

  const settingsItems = [
    { icon: <User size={20} />, label: t('adminProfile'), view: 'profile' as ActiveView },
    { icon: <Settings size={20} />, label: t('settings'), view: 'settings' as ActiveView },
  ];

  if (!open) {
    return (
      <aside className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="py-4 flex flex-col items-center space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveView(item.view)}
              className={`p-3 w-12 h-12 flex justify-center items-center rounded-lg transition-all duration-200 ${
                activeView === item.view
                  ? 'text-white bg-indigo-600 shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </div>
        <div className="mt-auto py-4 flex flex-col items-center border-t border-gray-700">
          {settingsItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveView(item.view)}
              className={`p-3 w-12 h-12 flex justify-center items-center rounded-lg transition-all duration-200 mb-2 ${
                activeView === item.view
                  ? 'text-white bg-indigo-600 shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
          <button 
            onClick={logout}
            className="p-3 w-12 h-12 flex justify-center items-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-all duration-200"
            title={language === 'ar' ? 'تسجيل الخروج' : 'Abmelden'}
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`w-64 bg-gray-800 transition-all duration-300 flex flex-col sidebar-responsive ${open ? 'open' : ''}`} dir={direction}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Bot size={20} className="text-white" />
          </div>
          <div className="flex-1" style={{ textAlign }}>
            <h2 className="font-bold text-white">
              {language === 'ar' ? 'مدير المهام' : 'Task Manager'}
            </h2>
            <p className="text-xs text-gray-400">
              {language === 'ar' ? 'نظام إدارة شامل' : 'Umfassendes Verwaltungssystem'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Menu */}
      <div className="py-4 flex-1 overflow-y-auto">
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ textAlign }}>
            {language === 'ar' ? 'القائمة الرئيسية' : 'HAUPTMENÜ'}
          </p>
        </div>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveView(item.view)}
            className={`px-4 py-3 w-full flex items-center gap-3 transition-all duration-200 sidebar-button ${
              activeView === item.view
                ? `text-white bg-indigo-600 ${isRTL ? 'border-r-2' : 'border-l-2'} border-indigo-400` 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            style={{ 
              textAlign,
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }}
          >
            {item.icon}
            <span className="font-medium text-sm flex-1" style={{ textAlign }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      
      {/* System Menu */}
      <div className="py-4 border-t border-gray-700">
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ textAlign }}>
            {language === 'ar' ? 'النظام' : 'SYSTEM'}
          </p>
        </div>
        {settingsItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveView(item.view)}
            className={`px-4 py-3 w-full flex items-center gap-3 transition-all duration-200 sidebar-button ${
              activeView === item.view
                ? `text-white bg-indigo-600 ${isRTL ? 'border-r-2' : 'border-l-2'} border-indigo-400` 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            style={{ 
              textAlign,
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }}
          >
            {item.icon}
            <span className="font-medium text-sm flex-1" style={{ textAlign }}>
              {item.label}
            </span>
          </button>
        ))}
        <button 
          onClick={logout}
          className={`px-4 py-3 w-full flex items-center gap-3 text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-all duration-200 sidebar-button`}
          style={{ 
            textAlign,
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }}
        >
          <LogOut size={20} />
          <span className="font-medium text-sm flex-1" style={{ textAlign }}>
            {language === 'ar' ? 'تسجيل الخروج' : 'Abmelden'}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
