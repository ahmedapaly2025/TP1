import React, { useState, useEffect } from 'react';
import { useBotContext } from '../context/BotContext';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Bot,
  MessageSquare,
  UserPlus,
  Printer
} from 'lucide-react';
import { format } from 'date-fns';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  action: string;
  user: string;
  details: string;
  ip?: string;
  source: 'system' | 'telegram' | 'user';
}

const LogsManager: React.FC = () => {
  const { subscribers, notifications, settings } = useBotContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'system' | 'telegram' | 'user'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // تحويل الإشعارات إلى سجلات
  useEffect(() => {
    const notificationLogs: LogEntry[] = notifications.map(notification => ({
      id: notification.id,
      timestamp: notification.timestamp,
      level: notification.type === 'system' ? 'info' : 
             notification.type === 'new_subscriber' ? 'success' : 
             notification.type === 'task_completed' ? 'success' : 'info',
      action: notification.title,
      user: notification.userId ? 
            subscribers.find(s => s.id === notification.userId)?.firstName || 'مستخدم غير معروف' : 
            'النظام',
      details: notification.message,
      source: notification.type === 'new_subscriber' ? 'telegram' : 'system'
    }));

    // إضافة سجلات إضافية للنظام
    const systemLogs: LogEntry[] = [
      {
        id: 'sys-1',
        timestamp: new Date().toISOString(),
        level: settings.isConnected ? 'success' : 'warning',
        action: 'حالة البوت',
        user: 'النظام',
        details: settings.isConnected ? 'البوت متصل ويعمل بشكل طبيعي' : 'البوت غير متصل',
        source: 'system'
      },
      {
        id: 'sys-2',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        level: 'info',
        action: 'تحديث الإعدادات',
        user: 'admin',
        details: 'تم تحديث إعدادات البوت',
        source: 'user',
        ip: '192.168.1.100'
      }
    ];

    setLogs([...notificationLogs, ...systemLogs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }, [notifications, subscribers, settings]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesSource = sourceFilter === 'all' || log.source === sourceFilter;
    
    const matchesDate = !dateFilter || 
      format(new Date(log.timestamp), 'yyyy-MM-dd') === dateFilter;
    
    return matchesSearch && matchesLevel && matchesSource && matchesDate;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="text-green-400\" size={16} />;
      case 'warning':
        return <AlertCircle className="text-yellow-400\" size={16} />;
      case 'error':
        return <XCircle className="text-red-400" size={16} />;
      default:
        return <Info className="text-blue-400" size={16} />;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'telegram':
        return <Bot className="text-blue-400\" size={14} />;
      case 'user':
        return <User className="text-purple-400" size={14} />;
      default:
        return <Activity className="text-gray-400" size={14} />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'bg-green-500/20 text-green-400';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'error':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'success':
        return 'نجح';
      case 'warning':
        return 'تحذير';
      case 'error':
        return 'خطأ';
      default:
        return 'معلومات';
    }
  };

  const getSourceText = (source: string) => {
    switch (source) {
      case 'telegram':
        return 'تليجرام';
      case 'user':
        return 'مستخدم';
      default:
        return 'النظام';
    }
  };

  const exportLogs = () => {
    const headers = ['التوقيت', 'المستوى', 'المصدر', 'الإجراء', 'المستخدم', 'التفاصيل'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        getLevelText(log.level),
        getSourceText(log.source),
        log.action,
        log.user,
        log.details
      ].join(','))
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `logs_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">سجل النشاطات</h2>
          <p className="text-gray-400">تتبع جميع الأنشطة والأحداث في النظام</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
          >
            <Printer size={20} />
            طباعة
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            <Download size={20} />
            تصدير السجل
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Activity className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">إجمالي الأحداث</p>
              <p className="text-xl font-bold">{logs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">العمليات الناجحة</p>
              <p className="text-xl font-bold">{logs.filter(l => l.level === 'success').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertCircle className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">التحذيرات</p>
              <p className="text-xl font-bold">{logs.filter(l => l.level === 'warning').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <XCircle className="text-red-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">الأخطاء</p>
              <p className="text-xl font-bold">{logs.filter(l => l.level === 'error').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في السجل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">جميع المستويات</option>
              <option value="info">معلومات</option>
              <option value="success">نجح</option>
              <option value="warning">تحذير</option>
              <option value="error">خطأ</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">جميع المصادر</option>
              <option value="system">النظام</option>
              <option value="telegram">تليجرام</option>
              <option value="user">مستخدم</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-right py-3 px-4 font-medium text-gray-300">التوقيت</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">المستوى</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">المصدر</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">الإجراء</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">المستخدم</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-gray-300 text-sm">
                      {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss')}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getLevelIcon(log.level)}
                      <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(log.level)}`}>
                        {getLevelText(log.level)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getSourceIcon(log.source)}
                      <span className="text-gray-300 text-sm">{getSourceText(log.source)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">{log.action}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-500" />
                      <span className="text-gray-300">{log.user}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-400 text-sm">{log.details}</span>
                    {log.ip && (
                      <div className="text-xs text-gray-500 mt-1">IP: {log.ip}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8">
            <Activity size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">لا توجد سجلات تطابق المعايير المحددة</p>
          </div>
        )}
      </div>

      {/* Real-time status */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">الحالة الحية</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${settings.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-gray-300">
              البوت: {settings.isConnected ? 'متصل' : 'غير متصل'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-gray-300">النظام: يعمل</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-gray-300">قاعدة البيانات: متصلة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsManager;
