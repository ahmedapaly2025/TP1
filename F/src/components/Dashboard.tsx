import React from 'react';
import { useBotContext } from '../context/BotContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';
import StatCard from './StatCard';
import AreaChartWidget from './charts/AreaChartWidget';
import BarChartWidget from './charts/BarChartWidget';
import LineChartWidget from './charts/LineChartWidget';
import PieChartWidget from './charts/PieChartWidget';
import RecentActivity from './RecentActivity';
import { 
  Users, 
  MessageSquare, 
  CheckSquare, 
  DollarSign,
  TrendingUp,
  Zap,
  Radio,
  Wifi,
  WifiOff
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { stats, subscribers, tasks, settings, isPolling } = useBotContext();
  const { language, direction, textAlign } = useLanguage();
  const { t } = useTranslation(language);

  // حساب الإحصائيات الحقيقية من البيانات الفعلية
  const realStats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.isActive).length,
    totalCommands: 5, // الأوامر الأساسية
    activeTasks: tasks.filter(t => t.status === 'active').length,
    totalRevenue: subscribers.reduce((sum, s) => sum + s.totalEarnings, 0),
    monthlyRevenue: subscribers.reduce((sum, s) => sum + s.totalEarnings, 0), // مبسط للعرض
    commandUsage: 0, // سيتم تحديثه مع الاستخدام
    taskCompletion: tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0,
  };

  return (
    <div className="space-responsive pb-6" dir={direction}>
      {/* حالة البوت */}
      <section className="bg-gray-800 rounded-lg p-4 border border-gray-700 responsive-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3" style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }}>
            <div className={`p-2 rounded-lg ${settings.isConnected ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {settings.isConnected ? (
                <Wifi className="text-green-400" size={20} />
              ) : (
                <WifiOff className="text-red-400" size={20} />
              )}
            </div>
            <div style={{ textAlign }}>
              <h3 className="text-lg font-semibold text-white">
                {t('botStatus')}: {settings.isConnected ? t('botConnected') : t('botDisconnected')}
              </h3>
              <p className="text-gray-400 text-sm">
                {settings.isConnected 
                  ? `${t('botUsername')} ${settings.botUsername} ${t('readyToWork')}` 
                  : t('needsConnection')}
              </p>
            </div>
          </div>
          
          {settings.isConnected && (
            <div className="flex items-center gap-2">
              {isPolling ? (
                <>
                  <Radio className="text-green-400 animate-pulse" size={16} />
                  <span className="text-green-400 text-sm">{t('receivingMessages')}</span>
                </>
              ) : (
                <>
                  <Radio className="text-gray-400" size={16} />
                  <span className="text-gray-400 text-sm">{t('stopped')}</span>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-6" style={{ textAlign }}>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{t('overview')}</h2>
          <p className="text-gray-400 text-sm sm:text-base">{t('comprehensiveStats')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stats-responsive">
          <StatCard
            title={t('totalTechnicians')}
            value={realStats.totalSubscribers.toLocaleString()}
            change={realStats.totalSubscribers > 0 ? 100 : 0}
            icon={<Users className="text-blue-500" />}
          />
          <StatCard
            title={t('activeTechnicians')}
            value={realStats.activeSubscribers.toLocaleString()}
            change={realStats.activeSubscribers > 0 ? 100 : 0}
            icon={<TrendingUp className="text-emerald-500" />}
          />
          <StatCard
            title={t('totalCommands')}
            value={realStats.totalCommands.toString()}
            change={0}
            icon={<MessageSquare className="text-purple-500" />}
          />
          <StatCard
            title={t('activeTasks')}
            value={realStats.activeTasks.toString()}
            change={realStats.activeTasks > 0 ? 100 : 0}
            icon={<CheckSquare className="text-orange-500" />}
          />
        </div>
      </section>

      <section>
        <div className="mb-6" style={{ textAlign }}>
          <h2 className="text-lg sm:text-xl font-bold mb-2">{t('financialStats')}</h2>
          <p className="text-gray-400 text-sm sm:text-base">{t('trackRevenue')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stats-responsive">
          <StatCard
            title={t('totalEarnings')}
            value={`${realStats.totalRevenue.toLocaleString()} ${t('riyal')}`}
            change={realStats.totalRevenue > 0 ? 100 : 0}
            icon={<DollarSign className="text-emerald-500" />}
          />
          <StatCard
            title={t('monthlyRevenue')}
            value={`${realStats.monthlyRevenue.toLocaleString()} ${t('riyal')}`}
            change={realStats.monthlyRevenue > 0 ? 100 : 0}
            icon={<TrendingUp className="text-blue-500" />}
          />
          <StatCard
            title={t('commandUsage')}
            value={realStats.commandUsage.toLocaleString()}
            change={0}
            icon={<Zap className="text-purple-500" />}
          />
          <StatCard
            title={t('taskCompletionRate')}
            value={`${realStats.taskCompletion.toFixed(1)}%`}
            change={realStats.taskCompletion > 0 ? realStats.taskCompletion : 0}
            icon={<CheckSquare className="text-orange-500" />}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartWidget title={t('revenueGrowth')} />
        <LineChartWidget title={t('technicianGrowth')} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BarChartWidget title={t('commandUsage')} />
        <BarChartWidget title={t('taskCompletion')} variant="horizontal" />
        <div className="space-y-6">
          <PieChartWidget title={t('taskDistribution')} />
        </div>
      </section>

      <section>
        <RecentActivity />
      </section>
    </div>
  );
};

export default Dashboard;
