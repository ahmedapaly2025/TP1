import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import AreaChartWidget from './charts/AreaChartWidget';
import BarChartWidget from './charts/BarChartWidget';
import LineChartWidget from './charts/LineChartWidget';
import PieChartWidget from './charts/PieChartWidget';
import { TimeRange } from '../types';

interface AnalyticsManagerProps {
  timeRange: TimeRange;
}

const AnalyticsManager: React.FC<AnalyticsManagerProps> = ({ timeRange }) => {
  const { stats, subscribers, tasks, commands } = useBotContext();
  const [analyticsType, setAnalyticsType] = useState<'performance' | 'engagement' | 'revenue' | 'growth'>('performance');

  const analyticsTypes = [
    { value: 'performance', label: 'الأداء العام', icon: <TrendingUp size={16} /> },
    { value: 'engagement', label: 'التفاعل', icon: <Activity size={16} /> },
    { value: 'revenue', label: 'الإيرادات', icon: <DollarSign size={16} /> },
    { value: 'growth', label: 'النمو', icon: <Users size={16} /> },
  ];

  const performanceMetrics = [
    {
      title: 'معدل إنجاز المهام',
      value: `${stats.taskCompletion}%`,
      change: 5.2,
      icon: <Activity className="text-blue-400\" size={24} />,
    },
    {
      title: 'متوسط وقت الاستجابة',
      value: '2.3 ثانية',
      change: -12.5,
      icon: <TrendingUp className="text-green-400" size={24} />,
    },
    {
      title: 'معدل الاحتفاظ',
      value: '87.5%',
      change: 3.1,
      icon: <Users className="text-purple-400\" size={24} />,
    },
    {
      title: 'متوسط الأرباح لكل مستخدم',
      value: '125 ريال',
      change: 8.7,
      icon: <DollarSign className="text-emerald-400" size={24} />,
    },
  ];

  const renderPerformanceAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              {metric.icon}
              <div>
                <p className="text-gray-400 text-sm">{metric.title}</p>
                <p className="text-xl font-bold text-white">{metric.value}</p>
                <p className={`text-sm ${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartWidget title="أداء النظام" timeRange={timeRange} />
        <LineChartWidget title="نشاط المستخدمين" timeRange={timeRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BarChartWidget title="أداء المهام" timeRange={timeRange} />
        <BarChartWidget title="استخدام الأوامر" timeRange={timeRange} variant="horizontal" />
        <PieChartWidget title="توزيع الأنشطة" timeRange={timeRange} />
      </div>
    </div>
  );

  const renderEngagementAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">معدل التفاعل اليومي</h4>
          <p className="text-2xl font-bold text-blue-400">78.5%</p>
          <p className="text-sm text-green-400">+5.2% من الأمس</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">متوسط الجلسات</h4>
          <p className="text-2xl font-bold text-purple-400">4.2</p>
          <p className="text-sm text-green-400">+2.1% من الأسبوع الماضي</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">وقت الجلسة</h4>
          <p className="text-2xl font-bold text-emerald-400">12 دقيقة</p>
          <p className="text-sm text-red-400">-1.5% من الشهر الماضي</p>
        </div>
      </div>
      <BarChartWidget title="تفاعل المستخدمين" timeRange={timeRange} />
    </div>
  );

  const renderRevenueAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">الإيرادات الشهرية</h4>
          <p className="text-2xl font-bold text-emerald-400">{stats.monthlyRevenue.toLocaleString()} ريال</p>
          <p className="text-sm text-green-400">+15.8% من الشهر الماضي</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">متوسط الإيرادات اليومية</h4>
          <p className="text-2xl font-bold text-blue-400">{Math.round(stats.monthlyRevenue / 30).toLocaleString()} ريال</p>
          <p className="text-sm text-green-400">+8.3% من الأسبوع الماضي</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">هامش الربح</h4>
          <p className="text-2xl font-bold text-purple-400">68.5%</p>
          <p className="text-sm text-green-400">+2.1% من الشهر الماضي</p>
        </div>
      </div>
      <AreaChartWidget title="نمو الإيرادات" timeRange={timeRange} />
    </div>
  );

  const renderGrowthAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">معدل النمو الشهري</h4>
          <p className="text-2xl font-bold text-green-400">12.5%</p>
          <p className="text-sm text-green-400">+2.3% من الشهر الماضي</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">فنيين جدد هذا الشهر</h4>
          <p className="text-2xl font-bold text-blue-400">1,247</p>
          <p className="text-sm text-green-400">+18.7% من الشهر الماضي</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">معدل الإلغاء</h4>
          <p className="text-2xl font-bold text-red-400">2.1%</p>
          <p className="text-sm text-green-400">-0.5% من الشهر الماضي</p>
        </div>
      </div>
      <LineChartWidget title="نمو الفنيين" timeRange={timeRange} />
    </div>
  );

  const renderAnalyticsContent = () => {
    switch (analyticsType) {
      case 'engagement':
        return renderEngagementAnalytics();
      case 'revenue':
        return renderRevenueAnalytics();
      case 'growth':
        return renderGrowthAnalytics();
      default:
        return renderPerformanceAnalytics();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">التحليلات المتقدمة</h2>
          <p className="text-gray-400">تحليل شامل لأداء النظام والمستخدمين</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors">
            <Download size={20} />
            تصدير التحليلات
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-gray-300 text-sm">نوع التحليل:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analyticsTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setAnalyticsType(type.value as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  analyticsType === type.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {renderAnalyticsContent()}
      </div>
    </div>
  );
};

export default AnalyticsManager;
