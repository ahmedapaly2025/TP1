import React, { useState, useEffect } from 'react';
import { useBotContext } from '../context/BotContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';
import { 
  Settings, 
  Bot, 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff,
  CheckCircle,
  XCircle,
  Loader,
  Key,
  Save,
  TestTube,
  Wifi,
  WifiOff,
  AlertTriangle,
  Play,
  Pause,
  Radio,
  Shield,
  Globe
} from 'lucide-react';

const SettingsManager: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    testBotConnection, 
    addNotification, 
    startTelegramPolling, 
    stopTelegramPolling, 
    isPolling
  } = useBotContext();
  
  const { language, setLanguage, direction, textAlign } = useLanguage();
  const { t } = useTranslation(language);
  
  const [localSettings, setLocalSettings] = useState(settings);
  const [connectionTestResult, setConnectionTestResult] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      updateSettings({ ...localSettings, language });
      await new Promise(resolve => setTimeout(resolve, 1000));

      addNotification({
        type: 'system',
        title: '✅ ' + t('success'),
        message: language === 'ar' ? 'تم حفظ إعدادات البوت بنجاح' : 'Bot-Einstellungen erfolgreich gespeichert'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionTestResult(null);
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${localSettings.botToken}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        setConnectionTestResult(true);
        const newSettings = { 
          ...localSettings, 
          isConnected: true, 
          lastSync: new Date().toISOString(),
          botUsername: data.result.username 
        };
        setLocalSettings(newSettings);
        updateSettings(newSettings);

        addNotification({
          type: 'system',
          title: '✅ ' + t('success'),
          message: language === 'ar' 
            ? `تم الاتصال بالبوت @${data.result.username} بنجاح! البوت جاهز لاستقبال الرسائل.`
            : `Erfolgreich mit Bot @${data.result.username} verbunden! Bot ist bereit, Nachrichten zu empfangen.`
        });
      } else {
        setConnectionTestResult(false);
        setLocalSettings(prev => ({ ...prev, isConnected: false }));
        
        addNotification({
          type: 'system',
          title: '❌ ' + t('error'),
          message: language === 'ar' 
            ? `فشل الاتصال بالبوت: ${data.description}`
            : `Bot-Verbindung fehlgeschlagen: ${data.description}`
        });
      }
    } catch (error) {
      setConnectionTestResult(false);
      setLocalSettings(prev => ({ ...prev, isConnected: false }));
      
      addNotification({
        type: 'system',
        title: '❌ ' + t('error'),
        message: language === 'ar' 
          ? 'تحقق من اتصال الإنترنت ورمز البوت'
          : 'Überprüfen Sie die Internetverbindung und das Bot-Token'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleBotTokenChange = (token: string) => {
    setLocalSettings({ ...localSettings, botToken: token });
    if (token !== settings.botToken) {
      setLocalSettings(prev => ({ ...prev, isConnected: false }));
      setConnectionTestResult(null);
    }
  };

  const toggleSound = () => {
    const newSoundEnabled = !localSettings.soundEnabled;
    const newSettings = { ...localSettings, soundEnabled: newSoundEnabled };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
    
    addNotification({
      type: 'system',
      title: newSoundEnabled ? '🔊 ' + t('success') : '🔇 ' + t('success'),
      message: language === 'ar'
        ? (newSoundEnabled ? 'سيتم تشغيل أصوات الإشعارات' : 'تم إيقاف أصوات الإشعارات')
        : (newSoundEnabled ? 'Benachrichtigungstöne werden abgespielt' : 'Benachrichtigungstöne wurden deaktiviert')
    });
  };

  const handleTogglePolling = () => {
    if (isPolling) {
      stopTelegramPolling();
    } else {
      startTelegramPolling();
    }
  };

  const handleLanguageChange = (newLanguage: 'ar' | 'de') => {
    setLanguage(newLanguage);
    addNotification({
      type: 'system',
      title: '🌐 ' + t('success'),
      message: newLanguage === 'ar' 
        ? 'تم تغيير اللغة إلى العربية'
        : 'Sprache wurde auf Deutsch geändert'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900" dir={direction}>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div style={{ textAlign }}>
            <h2 className="text-2xl font-bold">{t('settings')}</h2>
            <p className="text-gray-400">
              {t('systemSettings')}
            </p>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 rounded-lg text-white transition-colors"
          >
            {isSaving ? (
              <>
                <Loader size={20} className="animate-spin" />
                {language === 'ar' ? 'جاري الحفظ...' : 'Speichern...'}
              </>
            ) : (
              <>
                <Save size={20} />
                {t('save')}
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language Settings */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-6" style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }}>
              <div className="p-2 bg-blue-600 rounded-lg">
                <Globe size={20} className="text-white" />
              </div>
              <div style={{ textAlign }}>
                <h3 className="text-lg font-semibold text-white">{t('language')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('interfaceLanguage')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3" style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }}>
                  <span className="text-2xl">🇸🇦</span>
                  <div style={{ textAlign }}>
                    <p className="text-white font-medium">{t('arabic')}</p>
                    <p className="text-gray-400 text-sm">
                      {t('arabicDefault')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleLanguageChange('ar')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    language === 'ar' ? 'bg-indigo-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      language === 'ar' ? (direction === 'rtl' ? 'translate-x-1' : 'translate-x-6') : (direction === 'rtl' ? 'translate-x-6' : 'translate-x-1')
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3" style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }}>
                  <span className="text-2xl">🇩🇪</span>
                  <div style={{ textAlign }}>
                    <p className="text-white font-medium">{t('german')}</p>
                    <p className="text-gray-400 text-sm">
                      {language === 'ar' ? 'الألمانية' : 'Deutsch'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleLanguageChange('de')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    language === 'de' ? 'bg-indigo-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      language === 'de' ? (direction === 'rtl' ? 'translate-x-1' : 'translate-x-6') : (direction === 'rtl' ? 'translate-x-6' : 'translate-x-1')
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Bot Configuration */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-6" style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }}>
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Bot size={20} className="text-white" />
              </div>
              <div style={{ textAlign }}>
                <h3 className="text-lg font-semibold text-white">
                  {t('botConfiguration')}
                </h3>
                <p className="text-gray-400 text-sm">
                  {t('connectTelegramBot')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                  <Key size={16} className={`inline ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                  {t('botToken')}
                </label>
                <input
                  type="password"
                  value={localSettings.botToken}
                  onChange={(e) => handleBotTokenChange(e.target.value)}
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textAlign: 'left', direction: 'ltr' }}
                />
                <p className="text-xs text-gray-500 mt-1" style={{ textAlign }}>
                  {t('getBotTokenFromBotFather')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                  <Bot size={16} className={`inline ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                  {t('botUsername')}
                </label>
                <input
                  type="text"
                  value={localSettings.botUsername}
                  onChange={(e) => setLocalSettings({ ...localSettings, botUsername: e.target.value })}
                  placeholder="@your_bot_username"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textAlign: 'left', direction: 'ltr' }}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  {localSettings.isConnected ? (
                    <>
                      <Wifi size={16} className="text-green-400" />
                      <span className="text-green-400 text-sm">{t('botConnected')}</span>
                      {isPolling && (
                        <div className="flex items-center gap-1 ml-2">
                          <Radio size={12} className="text-blue-400 animate-pulse" />
                          <span className="text-blue-400 text-xs">{t('receivingMessages')}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <WifiOff size={16} className="text-red-400" />
                      <span className="text-red-400 text-sm">{t('botDisconnected')}</span>
                    </>
                  )}
                </div>
                
                <button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection || !localSettings.botToken}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white text-sm transition-colors"
                >
                  {isTestingConnection ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      {language === 'ar' ? 'اختبار...' : 'Testen...'}
                    </>
                  ) : (
                    <>
                      <TestTube size={16} />
                      {t('testConnection')}
                    </>
                  )}
                </button>
              </div>

              {connectionTestResult !== null && (
                <div className={`p-3 rounded-lg ${connectionTestResult ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  <p className={`text-sm ${connectionTestResult ? 'text-green-400' : 'text-red-400'}`} style={{ textAlign }}>
                    {connectionTestResult 
                      ? (language === 'ar' ? '✅ تم الاتصال بالبوت بنجاح!' : '✅ Bot erfolgreich verbunden!')
                      : (language === 'ar' ? '❌ فشل في الاتصال بالبوت. تحقق من الرمز.' : '❌ Bot-Verbindung fehlgeschlagen. Token überprüfen.')
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Message Polling Control */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-6" style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }}>
              <div className="p-2 bg-blue-600 rounded-lg">
                <Radio size={20} className="text-white" />
              </div>
              <div style={{ textAlign }}>
                <h3 className="text-lg font-semibold text-white">
                  {t('messageReceiving')}
                </h3>
                <p className="text-gray-400 text-sm">
                  {t('controlTelegramMessages')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3" style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }}>
                  {isPolling ? (
                    <Radio size={20} className="text-green-400 animate-pulse" />
                  ) : (
                    <Radio size={20} className="text-gray-400" />
                  )}
                  <div style={{ textAlign }}>
                    <p className="text-white font-medium">
                      {t('receivingStatus')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {isPolling 
                        ? t('receivingFromTelegram')
                        : t('receptionStopped')
                      }
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleTogglePolling}
                  disabled={!localSettings.isConnected}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
                    isPolling 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } disabled:bg-gray-600`}
                >
                  {isPolling ? (
                    <>
                      <Pause size={16} />
                      {t('stopReceiving')}
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      {t('startReceiving')}
                    </>
                  )}
                </button>
              </div>

              {isPolling && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-green-400 text-sm">
                      {t('botReceivingNow')}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs mt-1" style={{ textAlign }}>
                    {t('testSystemInstructions')}
                  </p>
                </div>
              )}

              {!localSettings.isConnected && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-yellow-400" />
                    <span className="text-yellow-400 text-sm">
                      {t('mustConnectBotFirst')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-6" style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }}>
              <div className="p-2 bg-orange-600 rounded-lg">
                <Bell size={20} className="text-white" />
              </div>
              <div style={{ textAlign }}>
                <h3 className="text-lg font-semibold text-white">
                  {t('notificationSettings')}
                </h3>
                <p className="text-gray-400 text-sm">
                  {t('customizeNotifications')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3" style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }}>
                  {localSettings.notificationsEnabled ? (
                    <Bell size={20} className="text-green-400" />
                  ) : (
                    <BellOff size={20} className="text-gray-400" />
                  )}
                  <div style={{ textAlign }}>
                    <p className="text-white font-medium">
                      {t('notifications')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {t('enableSystemNotifications')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setLocalSettings({ 
                    ...localSettings, 
                    notificationsEnabled: !localSettings.notificationsEnabled 
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.notificationsEnabled ? (direction === 'rtl' ? 'translate-x-1' : 'translate-x-6') : (direction === 'rtl' ? 'translate-x-6' : 'translate-x-1')
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3" style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }}>
                  {localSettings.soundEnabled ? (
                    <Volume2 size={20} className="text-green-400" />
                  ) : (
                    <VolumeX size={20} className="text-gray-400" />
                  )}
                  <div style={{ textAlign }}>
                    <p className="text-white font-medium">
                      {t('sounds')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {t('playNotificationSounds')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleSound}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.soundEnabled ? 'bg-indigo-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.soundEnabled ? (direction === 'rtl' ? 'translate-x-1' : 'translate-x-6') : (direction === 'rtl' ? 'translate-x-6' : 'translate-x-1')
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
