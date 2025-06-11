import { format, subDays } from 'date-fns';
import { BotCommand, Subscriber, Task, AutoResponse, Invoice, BotStats } from '../types';

export const generateBotMockData = () => {
  // Bot statistics - بيانات فارغة للبداية
  const stats: BotStats = {
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalCommands: 6, // الأوامر الأساسية + /ok + /no
    activeTasks: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    commandUsage: 0,
    taskCompletion: 0,
  };

  // Bot commands - الأوامر الأساسية + أوامر الموافقة والرفض
  const commands: BotCommand[] = [
    {
      id: '1',
      command: '/start',
      description: 'رسالة ترحيب للمستخدمين الجدد',
      response: 'مرحباً بك في بوت إدارة المهام! 🎉\nيمكنك البدء بكسب المال من خلال إنجاز المهام البسيطة.',
      isActive: true,
      usage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      command: '/help',
      description: 'عرض الأوامر المتاحة',
      response: 'الأوامر المتاحة:\n/tasks - عرض المهام المتاحة\n/balance - عرض رصيدك\n/profile - عرض ملفك الشخصي\n/ok - قبول المهمة\n/no - رفض المهمة',
      isActive: true,
      usage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      command: '/tasks',
      description: 'عرض المهام المتاحة',
      response: 'المهام المتاحة حالياً:\n\n🔔 ستصلك إشعارات تلقائية عند توفر مهام جديدة!\n\n📝 للموافقة على أي مهمة، اكتب: /ok\n❌ للرفض، اكتب: /no',
      isActive: true,
      usage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      command: '/balance',
      description: 'عرض رصيد المستخدم',
      response: 'رصيدك الحالي: {balance} ريال 💰\nالمهام المكتملة: {completed_tasks}\nآخر نشاط: {last_activity}',
      isActive: true,
      usage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      command: '/profile',
      description: 'عرض الملف الشخصي',
      response: 'ملفك الشخصي:\n👤 الاسم: {name}\n🔧 المهنة: {profession}\n📅 تاريخ الانضمام: {join_date}\n⭐ التقييم: {rating}/5',
      isActive: true,
      usage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '6',
      command: '/ok',
      description: 'قبول المهمة المتاحة',
      response: '✅ تم قبول المهمة بنجاح!\n\n🔧 سيتم إرسال تفاصيل المهمة والموقع قريباً.\n💰 ستحصل على أجرك فور إنجاز المهمة.',
      isActive: true,
      usage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '7',
      command: '/no',
      description: 'رفض المهمة المتاحة',
      response: '❌ لا مشكلة!\n\n💪 سنرسل لك مهمة أخرى قريباً!\n🔔 ابق متابعاً للإشعارات.',
      isActive: true,
      usage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // بيانات فارغة للبداية
  const subscribers: Subscriber[] = [];
  const tasks: Task[] = [];
  const autoResponses: AutoResponse[] = [];
  const invoices: Invoice[] = [];

  // Generate empty data arrays for charts
  const revenueData = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), 29 - i), 'MMM d');
    return {
      date,
      value: 0,
    };
  });

  const subscriberData = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), 29 - i), 'MMM d');
    return {
      date,
      value: 0,
    };
  });

  // Command usage data - فارغة
  const commandUsageData = [
    { name: '/start', value: 0 },
    { name: '/help', value: 0 },
    { name: '/tasks', value: 0 },
    { name: '/balance', value: 0 },
    { name: '/profile', value: 0 },
    { name: '/ok', value: 0 },
    { name: '/no', value: 0 },
  ];

  // Task completion data - فارغة
  const taskCompletionData = [
    { name: 'أعمال كهربائية', value: 0 },
    { name: 'أعمال سباكة', value: 0 },
    { name: 'أعمال نجارة', value: 0 },
    { name: 'أعمال تكييف', value: 0 },
    { name: 'أعمال دهان', value: 0 },
  ];

  return {
    stats,
    commands,
    subscribers,
    tasks,
    autoResponses,
    invoices,
    revenueData,
    subscriberData,
    commandUsageData,
    taskCompletionData,
  };
};
