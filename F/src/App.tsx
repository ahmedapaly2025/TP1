import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BotProvider } from './context/BotContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TasksManager from './components/TasksManager';
import SubscribersManager from './components/SubscribersManager';
import InvoicesManager from './components/InvoicesManager';
import ReportsManager from './components/ReportsManager';
import SettingsManager from './components/SettingsManager';
import AnalyticsManager from './components/AnalyticsManager';
import LogsManager from './components/LogsManager';
import AdminProfileManager from './components/AdminProfileManager';

export type ActiveView = 'dashboard' | 'tasks' | 'subscribers' | 'invoices' | 'reports' | 'settings' | 'analytics' | 'logs' | 'profile';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { direction, isRTL } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // Apply layout direction to the entire app
  useEffect(() => {
    document.documentElement.dir = direction;
    document.body.className = `${direction} ${isRTL ? 'rtl' : 'ltr'}`;
    
    // Force layout recalculation
    document.body.style.direction = direction;
    document.body.style.textAlign = isRTL ? 'right' : 'left';
  }, [direction, isRTL]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TasksManager />;
      case 'subscribers':
        return <SubscribersManager />;
      case 'invoices':
        return <InvoicesManager />;
      case 'reports':
        return <ReportsManager />;
      case 'settings':
        return <SettingsManager />;
      case 'analytics':
        return <AnalyticsManager />;
      case 'logs':
        return <LogsManager />;
      case 'profile':
        return <AdminProfileManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <BotProvider>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col" dir={direction}>
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        
        {/* Layout Container with proper RTL/LTR ordering */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - positioned based on language direction */}
          <div 
            className={`${sidebarOpen ? 'block' : 'hidden'} lg:block transition-all duration-300`}
          >
            <Sidebar 
              open={sidebarOpen} 
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </div>
          
          {/* Main content */}
          <main className="flex-1 overflow-auto">
            <div className="container-responsive space-responsive">
              {renderActiveView()}
            </div>
          </main>
        </div>
        
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </BotProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
