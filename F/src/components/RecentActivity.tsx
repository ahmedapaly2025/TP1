import React from 'react';
import { useBotContext } from '../context/BotContext';
import { 
  MessageSquare, 
  CheckSquare, 
  UserPlus, 
  DollarSign,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const RecentActivity: React.FC = () => {
  const { subscribers, tasks, commands } = useBotContext();

  // Generate recent activities (mock data for demo)
  const activities = [
    {
      id: '1',
      type: 'user_joined',
      message: 'انضم مشترك جديد: أحمد سالم',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      icon: <UserPlus className="text-green-500" />,
    },
    {
      id: '2',
      type: 'task_completed',
      message: 'تم إنجاز مهمة: مراجعة تطبيق التسوق',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      icon: <CheckSquare className="text-blue-500" />,
    },
    {
      id: '3',
      type: 'command_used',
      message: 'تم استخدام الأمر /balance 15 مرة',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      icon: <MessageSquare className="text-purple-500" />,
    },
    {
      id: '4',
      type: 'payment_made',
      message: 'تم دفع 750 ريال لـ أحمد سالم',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      icon: <DollarSign className="text-emerald-500" />,
    },
    {
      id: '5',
      type: 'user_joined',
      message: 'انضم مشترك جديد: سارة محمد',
      timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
      icon: <UserPlus className="text-green-500" />,
    },
    {
      id: '6',
      type: 'task_completed',
      message: 'تم إنجاز مهمة: استطلاع رأي حول المنتج الجديد',
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      icon: <CheckSquare className="text-blue-500" />,
    },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">النشاط الأخير</h3>
          <p className="text-gray-400 text-sm">آخر الأحداث في النظام</p>
        </div>
        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
          عرض الكل
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
            <div className="p-2 rounded-lg bg-gray-700/50">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{activity.message}</p>
              <div className="flex items-center gap-1 mt-1">
                <Clock size={12} className="text-gray-500" />
                <span className="text-gray-500 text-xs">
                  {format(activity.timestamp, 'HH:mm', { locale: ar })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
