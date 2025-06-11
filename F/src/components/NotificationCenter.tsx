import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { 
  Bell, 
  X, 
  CheckSquare, 
  UserPlus, 
  DollarSign, 
  Settings,
  Trash2,
  Eye,
  ExternalLink,
  Send,
  MessageSquare,
  Check,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ActiveView } from '../App';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveView: (view: ActiveView) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, setActiveView }) => {
  const { 
    notifications, 
    markNotificationRead, 
    clearAllNotifications, 
    subscribers, 
    tasks, 
    invoices,
    sendDirectMessageToTechnician 
  } = useBotContext();
  
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
      case 'task_accepted': // تم التعديل هنا
        return <CheckSquare className="text-green-400" size={16} />;
      case 'task_rejected': // تم التعديل هنا
        return <XCircle className="text-red-400" size={16} />;
      case 'new_subscriber':
        return <UserPlus className="text-green-400" size={16} />;
      case 'payment_received':
        return <DollarSign className="text-emerald-400" size={16} />;
      case 'technician_message':
        return <MessageSquare className="text-purple-400" size={16} />;
      case 'system':
        return <Settings className="text-purple-400" size={16} />;
      default:
        return <Bell className="text-gray-400" size={16} />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    markNotificationRead(notification.id);
    
    // إذا كانت رسالة من فني، فتح نافذة الرد
    if (notification.type === 'technician_message' && notification.userId) {
      setSelectedNotification(notification);
      setShowReplyModal(true);
      return;
    }
    
    // التوجه إلى الكيان المناسب بناءً على نوع الإشعار
    switch (notification.type) {
      case 'new_subscriber':
        if (notification.userId) {
          setActiveView('subscribers');
        }
        break;
      case 'task_accepted':
      case 'task_rejected':
      case 'task_completed':
        setActiveView('tasks');
        break;
      case 'payment_received':
        setActiveView('invoices');
        break;
      default:
        if (notification.title.includes('فاتورة')) {
          setActiveView('invoices');
        } else if (notification.title.includes('مهمة')) {
          setActiveView('tasks');
        } else {
          setActiveView('logs');
        }
    }
    
    onClose();
  };

  const handleSendReply = async () => {
    if (!selectedNotification || !replyMessage.trim() || isSending) return;
    
    setIsSending(true);
    
    try {
      const technician = subscribers.find(s => s.id === selectedNotification.userId);
      if (technician) {
        await sendDirectMessageToTechnician(technician.userId, replyMessage);
        
        // إغلاق النافذة وإعادة تعيين القيم
        setShowReplyModal(false);
        setSelectedNotification(null);
        setReplyMessage('');
        
        // إشعار نجاح
        alert('تم إرسال الرد بنجاح!');
      }
    } catch (error) {
      alert('حدث خطأ في إرسال الرد');
    } finally {
      setIsSending(false);
    }
  };

  const getEntityDetails = (notification: any) => {
    if (notification.userId) {
      const subscriber = subscribers.find(s => s.id === notification.userId);
      if (subscriber) {
        return {
          entityType: 'فني',
          entityName: `${subscriber.firstName} ${subscriber.lastName}`,
          entityId: subscriber.id
        };
      }
    }
    
    // البحث في المهام
    const taskMatch = notification.message.match(/المهمة[:\s]*"([^"]+)"/);
    if (taskMatch) {
      const taskTitle = taskMatch[1];
      const task = tasks.find(t => t.title === taskTitle);
      if (task) {
        return {
          entityType: 'مهمة',
          entityName: task.title,
          entityId: task.id
        };
      }
    }
    
    // البحث في الفواتير
    const invoiceMatch = notification.message.match(/فاتورة.*?(\d+)\s*ريال/);
    if (invoiceMatch) {
      const amount = invoiceMatch[1];
      const invoice = invoices.find(i => i.amount.toString() === amount);
      if (invoice) {
        return {
          entityType: 'فاتورة',
          entityName: `فاتورة ${amount} ريال`,
          entityId: invoice.id
        };
      }
    }
    
    return null;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-50 notification-responsive">
        <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4 border border-gray-700 max-h-[80vh] overflow-hidden responsive-modal">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Bell size={20} className="text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">الإشعارات</h3>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  title="مسح جميع الإشعارات"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">لا توجد إشعارات</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {notifications.map((notification) => {
                  const entityDetails = getEntityDetails(notification);
                  const isMessage = notification.type === 'technician_message';
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-indigo-500/5 border-r-2 border-indigo-500' : ''
                      } ${isMessage ? 'bg-purple-500/5 border-r-2 border-purple-500' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-700 rounded-lg flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm flex items-center gap-2">
                            {notification.title}
                            {isMessage && (
                              <Send size={12} className="text-purple-400" title="اضغط للرد" />
                            )}
                          </h4>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{notification.message}</p>
                          
                          {entityDetails && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                                {entityDetails.entityType}: {entityDetails.entityName}
                              </span>
                              <Eye size={12} className="text-gray-500" />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-gray-500 text-xs">
                              {format(new Date(notification.timestamp), 'dd/MM/yyyy HH:mm', { locale: ar })}
                            </p>
                            <div className="flex items-center gap-1">
                              {isMessage ? (
                                <span className="text-xs text-purple-400">اضغط للرد</span>
                              ) : (
                                <>
                                  <ExternalLink size={12} className="text-gray-500" />
                                  <span className="text-xs text-gray-500 hidden sm:inline">اضغط للعرض</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-700 bg-gray-800/50">
              <button
                onClick={() => {
                  setActiveView('logs');
                  onClose();
                }}
                className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                عرض جميع السجلات
              </button>
            </div>
          )}
        </div>
      </div>

      {/* نافذة الرد على رسائل الفنيين */}
      {showReplyModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">الرد على الفني</h3>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedNotification(null);
                  setReplyMessage('');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">
                <strong>الفني:</strong> {(() => {
                  const tech = subscribers.find(s => s.id === selectedNotification.userId);
                  return tech ? `${tech.firstName} ${tech.lastName}` : 'غير معروف';
                })()}
              </p>
              <p className="text-sm text-gray-400">
                <strong>الرسالة:</strong> {selectedNotification.message}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">ردك:</label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="اكتب ردك هنا..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ textAlign: 'right', direction: 'rtl' }}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSendReply}
                disabled={!replyMessage.trim() || isSending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 rounded-lg text-white transition-colors"
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {isSending ? 'جاري الإرسال...' : 'إرسال الرد'}
              </button>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedNotification(null);
                  setReplyMessage('');
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationCenter;
