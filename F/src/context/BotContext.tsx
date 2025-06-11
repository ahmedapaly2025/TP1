import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { generateBotMockData } from '../utils/botMockData';
import { Subscriber, Task, Invoice, BotStats, BotSettings, Notification, Language } from '../types';
import { useTranslation } from '../utils/translations';

interface BotContextType {
  stats: BotStats;
  subscribers: Subscriber[];
  tasks: Task[];
  invoices: Invoice[];
  settings: BotSettings;
  notifications: Notification[];
  revenueData: Array<{ date: string; value: number }>;
  subscriberData: Array<{ date: string; value: number }>;
  commandUsageData: Array<{ name: string; value: number }>;
  taskCompletionData: Array<{ name: string; value: number }>;
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedBy'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  
  updateSettings: (settings: Partial<BotSettings>) => void;
  testBotConnection: () => Promise<boolean>;
  
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Export functions
  exportReports: (type: string, timeRange: string) => void;
  exportInvoices: () => void;

  // Real bot integration
  addSubscriberFromTelegram: (telegramUser: any) => void;
  simulateWebhookMessage: (message: any) => void;
  
  // Subscriber management
  updateSubscriber: (id: string, updates: Partial<Subscriber>) => void;
  deleteSubscriber: (id: string) => void;
  addSubscriber: (subscriber: Omit<Subscriber, 'id'>) => void;

  // Task and Invoice notifications
  sendTaskToTechnician: (taskId: string, forceResend?: boolean) => void;
  sendInvoiceToTechnician: (invoiceId: string) => void;
  sendLocationToTechnician: (taskId: string, forceResend?: boolean) => void;

  // 🔥 NEW: إرسال رسائل مباشرة للفنيين
  sendDirectMessageToTechnician: (userId: string, message: string) => Promise<boolean>;
  sendCustomTaskToTechnicians: (technicianIds: string[], taskData: any) => Promise<boolean>;

  // Telegram polling for testing
  startTelegramPolling: () => void;
  stopTelegramPolling: () => void;
  isPolling: boolean;
  clearWebhook: () => Promise<boolean>;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export const BotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const mockData = generateBotMockData();
  
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    const saved = localStorage.getItem('taskManager_subscribers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskManager_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('taskManager_invoices');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [settings, setSettings] = useState<BotSettings>(() => {
    const saved = localStorage.getItem('taskManager_settings');
    return saved ? JSON.parse(saved) : {
      botToken: '',
      botUsername: '',
      webhookUrl: '',
      isConnected: false,
      lastSync: '',
      notificationsEnabled: true,
      soundEnabled: false,
      language: 'ar',
    };
  });
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('taskManager_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [isPolling, setIsPolling] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [lastUpdateId, setLastUpdateId] = useState(0);
  
  // 🔥 CRITICAL: نظام منع التكرار المطلق - محسن ومبسط
  const [processedUserIds, setProcessedUserIds] = useState<Set<string>>(new Set());
  const [lastMessageIds, setLastMessageIds] = useState<Map<string, number>>(new Map());

  // حفظ البيانات في localStorage عند التغيير
  useEffect(() => {
    localStorage.setItem('taskManager_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem('taskManager_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskManager_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('taskManager_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('taskManager_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // تحديث قائمة المستخدمين المسجلين عند تغيير المشتركين
  useEffect(() => {
    const userIds = new Set(subscribers.map(s => s.userId));
    setProcessedUserIds(userIds);
  }, [subscribers]);

  // إزالة webhook بسيط
  const clearWebhook = async (): Promise<boolean> => {
    if (!settings.botToken) return false;

    try {
      await fetch(`https://api.telegram.org/bot${settings.botToken}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: '', drop_pending_updates: true })
      });
      
      await fetch(`https://api.telegram.org/bot${settings.botToken}/deleteWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drop_pending_updates: true })
      });
      
      return true;
    } catch (error) {
      return true;
    }
  };

  const startTelegramPolling = async () => {
    if (isPolling) return;

    if (!settings.botToken || !settings.isConnected) {
      addNotification({
        type: 'system',
        title: '⚠️ لا يمكن بدء الاستقبال',
        message: 'تأكد من الاتصال بالبوت أولاً'
      });
      return;
    }
    
    console.log('🚀 بدء استقبال الرسائل...');
    
    // إزالة webhook
    await clearWebhook();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsPolling(true);
    
    const pollForUpdates = async () => {
      try {
        const response = await fetch(`https://api.telegram.org/bot${settings.botToken}/getUpdates?offset=${lastUpdateId + 1}&timeout=5&limit=1`);
        
        if (!response.ok) {
          if (response.status === 409) {
            console.log('⚠️ تعارض 409 - سنتجاهله');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.ok && data.result.length > 0) {
          for (const update of data.result) {
            setLastUpdateId(update.update_id);
            
            if (update.message) {
              console.log('📨 رسالة جديدة:', update.message.text);
              await handleTelegramMessage(update.message);
            } else if (update.callback_query) {
              console.log('🔄 استقبال ضغط زر:', update.callback_query.data);
              await handleCallbackQuery(update.callback_query);
            }
          }
        }
      } catch (error) {
        console.error('❌ خطأ في استقبال الرسائل:', error);
      }
    };
    
    // استطلاع كل 10 ثوانٍ
    const interval = setInterval(pollForUpdates, 10000);
    setPollingInterval(interval);
    
    addNotification({
      type: 'system',
      title: '🚀 بدء استقبال الرسائل',
      message: 'البوت يستقبل الرسائل من التليجرام الآن!'
    });
    
    console.log('✅ تم بدء الاستقبال بنجاح');
  };

  const stopTelegramPolling = () => {
    if (!isPolling) return;
    
    console.log('⏹️ إيقاف استقبال الرسائل...');
    setIsPolling(false);
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    
    addNotification({
      type: 'system',
      title: '⏹️ تم إيقاف استقبال الرسائل',
      message: 'تم إيقاف استقبال الرسائل من التليجرام'
    });
  };

  // 🔥 CRITICAL: فحص إذا تم معالجة هذه الرسالة بالضبط مسبقاً
  const isDuplicateMessage = (userId: string, messageId: number): boolean => {
    const lastMessageId = lastMessageIds.get(userId);
    
    if (lastMessageId && messageId <= lastMessageId) {
      console.log(`🚫 رسالة مكررة من المستخدم ${userId}: messageId ${messageId} <= ${lastMessageId}`);
      return true;
    }
    
    // تحديث آخر message ID لهذا المستخدم
    setLastMessageIds(prev => new Map(prev.set(userId, messageId)));
    return false;
  };

  // 🔥 CRITICAL: فحص إذا كان المستخدم مسجل مسبقاً
  const isUserAlreadyRegistered = (userId: string): boolean => {
    return processedUserIds.has(userId);
  };

  const handleTelegramMessage = async (message: any) => {
    console.log('📨 معالجة رسالة:', message.text);
    
    try {
      const userId = message.from.id.toString();
      const messageText = message.text?.trim();
      const messageId = message.message_id;
      
      // 🔥 CRITICAL: فحص التكرار المطلق
      if (isDuplicateMessage(userId, messageId)) {
        return; // تجاهل الرسالة المكررة تماماً
      }
      
      if (message.text === '/start') {
        // 🔥 CRITICAL: فحص إذا كان المستخدم مسجل مسبقاً
        if (isUserAlreadyRegistered(userId)) {
          console.log('👋 مستخدم موجود - رسالة ترحيب بسيطة');
          
          const { t } = useTranslation(settings.language);
          const welcomeBackText = t('welcomeBackMessage', { name: message.from.first_name });
          
          await sendTelegramMessage(message.chat.id, welcomeBackText);
          
        } else {
          console.log('👤 مستخدم جديد - تسجيل واحد فقط');
          
          // 🔥 CRITICAL: تسجيل المستخدم فوراً في القائمة لمنع التكرار
          setProcessedUserIds(prev => new Set([...prev, userId]));
          
          const newSubscriber = addSubscriberFromTelegram(message.from);
          
          // رسالة ترحيب للمستخدم الجديد
          const { t } = useTranslation(settings.language);
          const welcomeText = t('welcomeMessage', { name: message.from.first_name });
          
          await sendTelegramMessage(message.chat.id, welcomeText);
          
          // إشعار واحد فقط في النظام
          addNotification({
            type: 'new_subscriber',
            title: '🎉 فني جديد انضم!',
            message: `انضم ${newSubscriber.firstName} ${newSubscriber.lastName || ''} (@${newSubscriber.username}) إلى النظام`,
            userId: newSubscriber.id
          });
        }
      } else {
        // 🔥 NEW: معالجة جميع الرسائل الأخرى كرسائل من الفنيين
        const subscriber = subscribers.find(s => s.userId === userId);
        
        if (subscriber) {
          // 🔥 NEW: رسالة عادية من الفني - إشعار للإدارة
          console.log(`💬 رسالة من الفني ${subscriber.firstName}: ${messageText}`);
          
          addNotification({
            type: 'technician_message',
            title: `💬 رسالة من ${subscriber.firstName} ${subscriber.lastName || ''}`,
            message: messageText,
            userId: subscriber.id
          });
        } else {
          // مستخدم غير مسجل
          console.log(`⚠️ المستخدم ${userId} غير مسجل في النظام`);
          await sendTelegramMessage(message.chat.id, '⚠️ يجب تسجيل الدخول أولاً بإرسال /start');
        }
      }
    } catch (error) {
      console.error('❌ خطأ في معالجة الرسالة:', error);
    }
  };

  // معالجة ضغط الأزرار
  const handleCallbackQuery = async (callbackQuery: any) => {
    try {
      const userId = callbackQuery.from.id.toString();
      const data = callbackQuery.data;
      const message = callbackQuery.message;
      const chatId = message.chat.id;
      
      // إجابة فورية لإزالة حالة التحميل على الزر
      await answerCallbackQuery(callbackQuery.id);
      
      const subscriber = subscribers.find(s => s.userId === userId);
      if (!subscriber) {
        console.log(`❌ فني غير موجود: ${userId}`);
        return;
      }
      
      if (data === 'ACCEPT_TASK') {
        // معالجة قبول المهمة
        await handleTaskAcceptance(subscriber);
        
        // إشعار للإدارة
        addNotification({
          type: 'task_accepted', // تم التعديل هنا
          title: '✅ تم قبول المهمة',
          message: `قبل ${subscriber.firstName} ${subscriber.lastName || ''} المهمة`,
          userId: subscriber.id
        });
        
        // تحديث الرسالة الأصلية لإزالة الأزرار
        await sendTelegramMessage(chatId, '✅ تم قبول المهمة بنجاح', { remove_keyboard: true });
        
      } else if (data === 'REJECT_TASK') {
        // معالجة رفض المهمة
        await handleTaskRejection(subscriber);
        
        // إشعار للإدارة
        addNotification({
          type: 'task_rejected', // تم التعديل هنا
          title: '❌ تم رفض المهمة',
          message: `رفض ${subscriber.firstName} ${subscriber.lastName || ''} المهمة`,
          userId: subscriber.id
        });
        
        // تحديث الرسالة الأصلية لإزالة الأزرار
        await sendTelegramMessage(chatId, '❌ تم رفض المهمة', { remove_keyboard: true });
      }
    } catch (error) {
      console.error('❌ خطأ في معالجة ضغط الزر:', error);
      addNotification({
        type: 'system',
        title: '❌ خطأ في معالجة الزر',
        message: `حدث خطأ أثناء معالجة ضغط الزر: ${error.message}`
      });
    }
  };

  // إجابة فورية على ضغط الزر
  const answerCallbackQuery = async (callbackQueryId: string) => {
    try {
      await fetch(`https://api.telegram.org/bot${settings.botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callbackQueryId })
      });
    } catch (error) {
      console.error('❌ خطأ في إرسال إجابة ضغط الزر:', error);
    }
  };

  // 🔥 CRITICAL: معالجة قبول المهمة - محسنة ومبسطة
  const handleTaskAcceptance = async (subscriber: Subscriber) => {
    // البحث عن آخر مهمة نشطة تم إرسالها لهذا الفني
    const availableTask = tasks.find(t => 
      t.status === 'active' && 
      !t.acceptedBy && 
      (t.type === 'group' || t.targetUsers.includes(subscriber.id))
    );
    
    if (availableTask) {
      // تحديث حالة المهمة - إضافة acceptedBy
      setTasks(prev => prev.map(t => 
        t.id === availableTask.id 
          ? { ...t, acceptedBy: subscriber.id, status: 'in_progress' } // تم التعديل هنا
          : t
      ));
      
      // رد للفني
      const { t } = useTranslation(settings.language);
      const acceptText = t('taskAcceptedMessage', {
        title: availableTask.title,
        cost: availableTask.expectedCost.toString()
      });
      
      await sendTelegramMessage(parseInt(subscriber.userId), acceptText);
      
      console.log(`✅ تم قبول المهمة ${availableTask.title} من قبل ${subscriber.firstName}`);
      
    } else {
      await sendTelegramMessage(parseInt(subscriber.userId), 'لا توجد مهام متاحة حالياً.');
    }
  };

  // 🔥 CRITICAL: معالجة رفض المهمة - محسنة ومبسطة
  const handleTaskRejection = async (subscriber: Subscriber) => {
    const availableTask = tasks.find(t => 
      t.status === 'active' && 
      !t.acceptedBy && 
      (t.type === 'group' || t.targetUsers.includes(subscriber.id))
    );
    
    if (availableTask) {
      // رد للفني
      const { t } = useTranslation(settings.language);
      const rejectText = t('taskRejectedMessage', { title: availableTask.title });
      
      await sendTelegramMessage(parseInt(subscriber.userId), rejectText);
      
      console.log(`❌ تم رفض المهمة ${availableTask.title} من قبل ${subscriber.firstName}`);
    } else {
      await sendTelegramMessage(parseInt(subscriber.userId), 'لا توجد مهام متاحة حالياً.');
    }
  };

  const sendTelegramMessage = async (chatId: number, text: string, replyMarkup?: any) => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${settings.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
          reply_markup: replyMarkup
        })
      });
      
      const data = await response.json();
      if (data.ok) {
        console.log('✅ تم إرسال الرسالة بنجاح');
        return data.result;
      } else {
        if (data.description === 'Forbidden: bot was blocked by the user') {
          const subscriber = subscribers.find(s => s.userId === chatId.toString());
          if (subscriber) {
            setSubscribers(prev => prev.map(s => 
              s.id === subscriber.id 
                ? { ...s, isActive: false }
                : s
            ));
          }
          console.log(`⚠️ المستخدم ${chatId} حظر البوت`);
        } else {
          console.error('❌ فشل إرسال الرسالة:', data.description);
        }
      }
    } catch (error) {
      console.error('❌ خطأ في إرسال الرسالة:', error);
    }
  };

  // 🔥 NEW: إرسال رسالة مباشرة لفني محدد
  const sendDirectMessageToTechnician = async (userId: string, message: string): Promise<boolean> => {
    if (!settings.isConnected || !settings.botToken) {
      addNotification({
        type: 'system',
        title: '⚠️ البوت غير متصل',
        message: 'يجب الاتصال بالبوت أولاً'
      });
      return false;
    }

    const technician = subscribers.find(s => s.userId === userId);
    if (!technician) {
      addNotification({
        type: 'system',
        title: '⚠️ فني غير موجود',
        message: 'لا يمكن العثور على الفني'
      });
      return false;
    }

    try {
      await sendTelegramMessage(parseInt(userId), message);
      
      addNotification({
        type: 'system',
        title: '📤 تم إرسال الرسالة',
        message: `تم إرسال رسالة إلى ${technician.firstName} ${technician.lastName || ''}`,
        userId: technician.id
      });
      
      return true;
    } catch (error) {
      console.error('❌ خطأ في إرسال الرسالة المباشرة:', error);
      return false;
    }
  };

  // 🔥 NEW: إرسال مهمة مخصصة لفنيين محددين
  const sendCustomTaskToTechnicians = async (technicianIds: string[], taskData: any): Promise<boolean> => {
    if (!settings.isConnected || !settings.botToken) {
      addNotification({
        type: 'system',
        title: '⚠️ البوت غير متصل',
        message: 'يجب الاتصال بالبوت أولاً'
      });
      return false;
    }

    const targetTechnicians = subscribers.filter(s => technicianIds.includes(s.id) && s.isActive);
    
    if (targetTechnicians.length === 0) {
      addNotification({
        type: 'system',
        title: '⚠️ لا يوجد فنيين',
        message: 'لا يوجد فنيين نشطين محددين'
      });
      return false;
    }

    let sentCount = 0;
    
    for (const technician of targetTechnicians) {
      try {
        // 🔥 NEW: استخدام الأزرار بدلاً من النص
        const replyMarkup = {
          inline_keyboard: [
            [
              { text: '✅ OK', callback_data: 'ACCEPT_TASK' },
              { text: '❌ NO / NOT / NAW', callback_data: 'REJECT_TASK' }
            ]
          ]
        };
        
        const message = `📌 مهمة مخصصة:\n\n🔧 ${taskData.title}\n📝 ${taskData.description}\n\n💰 التكلفة: ${taskData.cost} ريال`;
        
        await sendTelegramMessage(parseInt(technician.userId), message, replyMarkup);
        sentCount++;
        
        // تأخير بين الرسائل
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`❌ خطأ في إرسال المهمة للفني ${technician.firstName}:`, error);
      }
    }
    
    addNotification({
      type: 'system',
      title: '📤 تم إرسال المهمة المخصصة',
      message: `تم إرسال المهمة "${taskData.title}" إلى ${sentCount} فني`,
    });
    
    return sentCount > 0;
  };

  const sendTaskToTechnician = async (taskId: string, forceResend: boolean = false) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !settings.isConnected || !settings.botToken) {
      return;
    }

    const targetTechnicians = task.type === 'group' 
      ? subscribers.filter(s => s.isActive)
      : task.targetUsers.map(id => subscribers.find(s => s.id === id)).filter(Boolean);

    if (targetTechnicians.length === 0) {
      addNotification({
        type: 'system',
        title: '⚠️ لا يوجد فنيين',
        message: 'لا يوجد فنيين نشطين لإرسال المهمة إليهم'
      });
      return;
    }

    let sentCount = 0;
    
    for (const technician of targetTechnicians) {
      if (technician) {
        // 🔥 NEW: إرسال المهمة مع الأزرار
        const replyMarkup = {
          inline_keyboard: [
            [
              { text: '✅ OK', callback_data: 'ACCEPT_TASK' },
              { text: '❌ NO / NOT / NAW', callback_data: 'REJECT_TASK' }
            ]
          ]
        };
        
        const { t } = useTranslation(settings.language);
        const message = t('taskAvailable', {
          title: task.title,
          description: task.description,
          cost: task.expectedCost.toString(),
          startDate: new Date(task.startDate).toLocaleDateString(settings.language === 'ar' ? 'ar' : 'de'),
          endDate: new Date(task.endDate).toLocaleDateString(settings.language === 'ar' ? 'ar' : 'de')
        });

        await sendTelegramMessage(parseInt(technician.userId), message, replyMarkup);
        sentCount++;
        
        // تأخير بين الرسائل لتجنب spam
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // إشعار واحد فقط
    addNotification({
      type: 'system',
      title: forceResend ? '🔄 تم إعادة إرسال المهمة' : '📤 تم إرسال المهمة',
      message: `تم ${forceResend ? 'إعادة ' : ''}إرسال المهمة "${task.title}" إلى ${sentCount} فني`,
    });
  };

  const sendInvoiceToTechnician = async (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice || !settings.isConnected || !settings.botToken) {
      return;
    }

    const technician = subscribers.find(s => s.id === invoice.subscriberId);
    if (!technician) {
      addNotification({
        type: 'system',
        title: '⚠️ فني غير موجود',
        message: 'لا يمكن العثور على الفني المرتبط بالفاتورة'
      });
      return;
    }

    const message = `💰 فاتورة جديدة!\n\n📋 ${invoice.description}\n💵 المبلغ: ${invoice.amount} ريال\n📅 تاريخ الاستحقاق: ${new Date(invoice.dueDate).toLocaleDateString('ar')}\n\n${invoice.taskTitle ? `🔧 المهمة: ${invoice.taskTitle}\n` : ''}${invoice.actualCost ? `💸 التكلفة الفعلية: ${invoice.actualCost} ريال\n` : ''}${invoice.commission ? `🎯 العمولة: ${invoice.commission} ريال\n` : ''}\n📊 حالة الدفع: ${invoice.status === 'pending' ? 'معلقة ⏳' : invoice.status === 'paid' ? 'مدفوعة ✅' : 'ملغية ❌'}\n\n💡 سيتم التواصل معك لترتيب الدفع.`;

    await sendTelegramMessage(parseInt(technician.userId), message);
    
    addNotification({
      type: 'system',
      title: '💰 تم إرسال الفاتورة',
      message: `تم إرسال فاتورة بمبلغ ${invoice.amount} ريال إلى ${technician.firstName} ${technician.lastName || ''}`,
      userId: technician.id
    });
  };

  const sendLocationToTechnician = async (taskId: string, forceResend: boolean = false) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (!task || !task.locationUrl || !settings.isConnected || !settings.botToken) {
      console.log('⚠️ شروط إرسال الموقع غير مكتملة');
      
      addNotification({
        type: 'system',
        title: '⚠️ لا يمكن إرسال الموقع',
        message: !task ? 'المهمة غير موجودة' : 
                !task.locationUrl ? 'لا يوجد موقع محدد للمهمة' :
                'البوت غير متصل'
      });
      return;
    }

    // 🔥 CRITICAL: التحقق من وجود فني قبل المهمة
    if (!task.acceptedBy) {
      addNotification({
        type: 'system',
        title: '⚠️ لا يوجد فني قبل المهمة',
        message: 'يجب أن يقبل فني المهمة أولاً قبل إرسال الموقع'
      });
      return;
    }

    // تحديد الفني الذي قبل المهمة فقط
    const targetTechnician = subscribers.find(s => s.id === task.acceptedBy);

    if (!targetTechnician) {
      addNotification({
        type: 'system',
        title: '⚠️ الفني غير موجود',
        message: 'لا يمكن العثور على الفني الذي قبل المهمة'
      });
      return;
    }

    console.log(`📍 إرسال الموقع للفني ${targetTechnician.firstName} ${targetTechnician.lastName || ''}`);

    // رسالة الموقع
    const { t } = useTranslation(settings.language);
    const message = t('locationMessage', {
      title: task.title,
      location: task.locationUrl
    });

    await sendTelegramMessage(parseInt(targetTechnician.userId), message);
    
    // إشعار واحد فقط
    addNotification({
      type: 'system',
      title: forceResend ? '🔄 تم إعادة إرسال الموقع' : '📍 تم إرسال الموقع',
      message: `تم ${forceResend ? 'إعادة ' : ''}إرسال موقع المهمة "${task.title}" إلى ${targetTechnician.firstName} ${targetTechnician.lastName || ''}`,
      userId: targetTechnician.id
    });
    
    console.log('📍 تم إرسال الموقع بنجاح');
  };

  const addSubscriberFromTelegram = (telegramUser: any) => {
    const userId = telegramUser.id.toString();
    
    // 🔥 CRITICAL: فحص دقيق للمكررات - لا يجب أن يصل هنا إذا كان موجود
    const existingSubscriber = subscribers.find(s => s.userId === userId);
    
    if (!existingSubscriber) {
      const newSubscriber: Subscriber = {
        id: `telegram_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        username: telegramUser.username || `user_${telegramUser.id}`,
        firstName: telegramUser.first_name || 'مستخدم',
        lastName: telegramUser.last_name || '',
        joinedAt: new Date().toISOString(),
        isActive: true,
        tasksCompleted: 0,
        totalEarnings: 0,
        profession: 'فني'
      };

      setSubscribers(prev => [...prev, newSubscriber]);
      console.log('✅ تم إضافة فني جديد:', newSubscriber);
      return newSubscriber;
    }

    console.log('⚠️ المستخدم موجود بالفعل');
    return existingSubscriber;
  };

  const simulateWebhookMessage = (message: any) => {
    if (message.text === '/start') {
      const subscriber = addSubscriberFromTelegram(message.from);
      
      addNotification({
        type: 'system',
        title: 'تم إرسال رسالة ترحيبية',
        message: `تم إرسال رسالة ترحيبية إلى ${subscriber.firstName}`,
        userId: subscriber.id
      });
    }
  };

  const updateSubscriber = (id: string, updates: Partial<Subscriber>) => {
    setSubscribers(prev => prev.map(sub => 
      sub.id === id ? { ...sub, ...updates } : sub
    ));
    
    addNotification({
      type: 'system',
      title: '✅ تم تحديث بيانات الفني',
      message: `تم تحديث بيانات الفني بنجاح`,
    });
  };

  const deleteSubscriber = (id: string) => {
    const subscriber = subscribers.find(s => s.id === id);
    if (subscriber) {
      // تنظيف جميع البيانات المرتبطة
      setProcessedUserIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(subscriber.userId);
        return newSet;
      });
      
      setLastMessageIds(prev => {
        const newMap = new Map(prev);
        newMap.delete(subscriber.userId);
        return newMap;
      });
    }
    
    setSubscribers(prev => prev.filter(sub => sub.id !== id));
    
    addNotification({
      type: 'system',
      title: '🗑️ تم حذف الفني',
      message: 'تم حذف الفني من النظام نهائياً'
    });
  };

  const addSubscriber = (subscriber: Omit<Subscriber, 'id'>) => {
    const newSubscriber: Subscriber = {
      ...subscriber,
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setSubscribers(prev => [...prev, newSubscriber]);
    
    addNotification({
      type: 'system',
      title: '👤 تم إضافة فني جديد',
      message: `تم إضافة ${newSubscriber.firstName} ${newSubscriber.lastName || ''} بنجاح`
    });
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completedBy'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedBy: [],
    };
    setTasks(prev => [...prev, newTask]);
    
    addNotification({
      type: 'system',
      title: '✅ تم إنشاء مهمة جديدة',
      message: `تم إنشاء مهمة جديدة: ${task.title}`,
    });

    // إرسال المهمة تلقائياً إذا كان البوت متصل
    if (settings.isConnected && settings.botToken && isPolling) {
      setTimeout(() => {
        sendTaskToTechnician(newTask.id, false);
      }, 3000);
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const createInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setInvoices(prev => [...prev, newInvoice]);
    
    addNotification({
      type: 'system',
      title: '💰 تم إنشاء فاتورة جديدة',
      message: `تم إنشاء فاتورة جديدة بمبلغ ${invoice.amount} ريال`,
    });

    // إرسال الفاتورة تلقائياً إذا كان البوت متصل
    if (settings.isConnected && settings.botToken && isPolling) {
      setTimeout(() => {
        sendInvoiceToTechnician(newInvoice.id);
      }, 3000);
    }
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, ...updates } : inv
    ));
  };

  const updateSettings = (newSettings: Partial<BotSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const testBotConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${settings.botToken}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        setSettings(prev => ({ 
          ...prev, 
          isConnected: true,
          botUsername: data.result.username,
          lastSync: new Date().toISOString()
        }));
        
        addNotification({
          type: 'system',
          title: '✅ اتصال ناجح',
          message: `تم الاتصال بالبوت @${data.result.username} بنجاح!`
        });
        
        return true;
      } else {
        setSettings(prev => ({ ...prev, isConnected: false }));
        return false;
      }
    } catch (error) {
      setSettings(prev => ({ ...prev, isConnected: false }));
      return false;
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
    
    if (settings.soundEnabled && settings.notificationsEnabled) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (error) {
        console.log('لا يمكن تشغيل صوت الإشعار');
      }
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Export functions
  const exportReports = (type: string, timeRange: string) => {
    const currentDate = new Date().toISOString().split('T')[0];
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'technicians':
        csvContent = generateTechniciansReport();
        filename = `تقرير_الفنيين_${currentDate}.csv`;
        break;
      case 'tasks':
        csvContent = generateTasksReport();
        filename = `تقرير_المهام_${currentDate}.csv`;
        break;
      case 'financial':
        csvContent = generateFinancialReport();
        filename = `التقرير_المالي_${currentDate}.csv`;
        break;
      default:
        csvContent = generateOverviewReport();
        filename = `تقرير_عام_${currentDate}.csv`;
    }

    downloadCSV(csvContent, filename);
    
    addNotification({
      type: 'system',
      title: '📊 تم تصدير التقرير',
      message: `تم تصدير ${filename} بنجاح`,
    });
  };

  const exportInvoices = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const csvContent = generateFinancialReport();
    const filename = `الفواتير_${currentDate}.csv`;
    downloadCSV(csvContent, filename);
    
    addNotification({
      type: 'system',
      title: '💰 تم تصدير الفواتير',
      message: `تم تصدير ${filename} بنجاح`,
    });
  };

  const generateTechniciansReport = () => {
    const headers = ['اسم الفني', 'اسم المستخدم', 'Telegram ID', 'المهنة', 'المهام المكتملة', 'إجمالي الأرباح', 'تاريخ الانضمام', 'الحالة'];
    const rows = subscribers.map(sub => [
      `${sub.firstName} ${sub.lastName || ''}`,
      sub.username,
      sub.userId,
      sub.profession || 'غير محدد',
      sub.tasksCompleted.toString(),
      `${sub.totalEarnings} ريال`,
      new Date(sub.joinedAt).toLocaleDateString('ar'),
      sub.isActive ? 'نشط' : 'غير نشط'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateTasksReport = () => {
    const headers = ['اسم المهمة', 'النوع', 'التكلفة المتوقعة', 'تاريخ البداية', 'تاريخ الانتهاء', 'الحالة', 'الفنيين المخصصين', 'الفني المقبول', 'يحتوي على موقع', 'الإرسال التلقائي'];
    const rows = tasks.map(task => {
      const acceptedTechnician = task.acceptedBy ? subscribers.find(s => s.id === task.acceptedBy) : null;
      return [
        task.title,
        task.type === 'individual' ? 'فردية' : 'جماعية',
        `${task.expectedCost} ريال`,
        new Date(task.startDate).toLocaleDateString('ar'),
        new Date(task.endDate).toLocaleDateString('ar'),
        task.status === 'active' ? 'نشطة' : task.status === 'completed' ? 'مكتملة' : 'منتهية',
        task.type === 'group' ? 'جميع الفنيين' : task.targetUsers.length.toString(),
        acceptedTechnician ? `${acceptedTechnician.firstName} ${acceptedTechnician.lastName || ''}` : 'لا يوجد',
        task.locationUrl ? 'نعم' : 'لا',
        task.autoSendLocation ? 'نعم' : 'لا'
      ];
    });
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateFinancialReport = () => {
    const headers = ['رقم الفاتورة', 'الفني', 'المهمة', 'المبلغ', 'التكلفة الفعلية', 'العمولة', 'طريقة دفع العميل', 'طريقة استلام العمولة', 'الحالة', 'تاريخ الإنشاء', 'تاريخ البداية', 'تاريخ الانتهاء'];
    const rows = invoices.map(invoice => {
      const technician = subscribers.find(s => s.id === invoice.subscriberId);
      return [
        invoice.id,
        technician ? `${technician.firstName} ${technician.lastName || ''}` : 'غير محدد',
        invoice.taskTitle || 'غير محدد',
        `${invoice.amount} ريال`,
        invoice.actualCost ? `${invoice.actualCost} ريال` : 'غير محدد',
        invoice.commission ? `${invoice.commission} ريال` : 'غير محدد',
        invoice.clientPaymentMethod || 'غير محدد',
        invoice.commissionReceivedMethod || 'غير محدد',
        invoice.status === 'paid' ? 'مدفوعة' : invoice.status === 'pending' ? 'معلقة' : 'ملغية',
        new Date(invoice.createdAt).toLocaleDateString('ar'),
        invoice.startDate ? new Date(invoice.startDate).toLocaleDateString('ar') : 'غير محدد',
        invoice.endDate ? new Date(invoice.endDate).toLocaleDateString('ar') : 'غير محدد'
      ];
    });
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateOverviewReport = () => {
    const headers = ['المؤشر', 'القيمة'];
    const totalRevenue = subscribers.reduce((sum, s) => sum + s.totalEarnings, 0);
    const totalInvoiceAmount = invoices.reduce((sum, i) => sum + i.amount, 0);
    const totalCommissions = invoices.reduce((sum, i) => sum + (i.commission || 0), 0);
    const activeTasks = tasks.filter(t => t.status === 'active').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    
    const rows = [
      ['إجمالي الفنيين', subscribers.length.toString()],
      ['الفنيين النشطين', subscribers.filter(s => s.isActive).length.toString()],
      ['إجمالي المهام', tasks.length.toString()],
      ['المهام النشطة', activeTasks.toString()],
      ['المهام المكتملة', completedTasks.toString()],
      ['إجمالي أرباح الفنيين', `${totalRevenue} ريال`],
      ['إجمالي مبالغ الفواتير', `${totalInvoiceAmount} ريال`],
      ['إجمالي العمولات', `${totalCommissions} ريال`],
      ['عدد الفواتير المدفوعة', invoices.filter(i => i.status === 'paid').length.toString()],
      ['عدد الفواتير المعلقة', invoices.filter(i => i.status === 'pending').length.toString()]
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // حساب الإحصائيات الحقيقية من البيانات الفعلية
  const realStats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.isActive).length,
    totalCommands: 0, // لا توجد أوامر بعد الآن
    activeTasks: tasks.filter(t => t.status === 'active').length,
    totalRevenue: subscribers.reduce((sum, s) => sum + s.totalEarnings, 0),
    monthlyRevenue: invoices.reduce((sum, i) => sum + (i.commission || 0), 0),
    commandUsage: 0, // لا توجد أوامر بعد الآن
    taskCompletion: tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0,
  };

  const contextValue: BotContextType = {
    ...mockData,
    stats: realStats,
    subscribers,
    tasks,
    invoices,
    settings,
    notifications,
    isPolling,
    addTask,
    updateTask,
    deleteTask,
    createInvoice,
    updateInvoice,
    updateSettings,
    testBotConnection,
    addNotification,
    markNotificationRead,
    clearAllNotifications,
    exportReports,
    exportInvoices,
    addSubscriberFromTelegram,
    simulateWebhookMessage,
    updateSubscriber,
    deleteSubscriber,
    addSubscriber,
    sendTaskToTechnician,
    sendInvoiceToTechnician,
    sendLocationToTechnician,
    sendDirectMessageToTechnician,
    sendCustomTaskToTechnicians,
    startTelegramPolling,
    stopTelegramPolling,
    clearWebhook,
  };

  return (
    <BotContext.Provider value={contextValue}>
      {children}
    </BotContext.Provider>
  );
};

export const useBotContext = () => {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('useBotContext must be used within a BotProvider');
  }
  return context;
};
