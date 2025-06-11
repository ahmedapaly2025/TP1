export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y';
export type Language = 'ar' | 'de';

export interface DataPoint {
  date: string;
  value: number;
}

export interface NameValuePair {
  name: string;
  value: number;
}

// Bot Management Types
export interface BotCommand {
  id: string;
  command: string;
  description: string;
  response: string;
  isActive: boolean;
  usage: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscriber {
  id: string;
  userId: string;
  username: string;
  firstName: string;
  lastName?: string;
  joinedAt: string;
  isActive: boolean;
  tasksCompleted: number;
  totalEarnings: number;
  profession?: string; // مهنة الفني/الحرفي
  // تم حذف: specialization, location, rating, lastActivity
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'group';
  targetUsers: string[];
  expectedCost: number; // التكلفة المتوقعة بدلاً من المكافأة
  startDate: string; // تاريخ البداية
  endDate: string; // تاريخ الانتهاء
  deadline: string;
  status: 'active' | 'completed' | 'expired';
  completedBy: string[];
  createdAt: string;
  createdBy: string;
  assignedTechnician?: string; // الفني المخصص
  locationUrl?: string; // رابط خريطة الموقع
  autoSendLocation?: boolean; // إرسال الموقع تلقائياً أم يدوياً
  acceptedBy?: string; // الفني الذي قبل المهمة
}

export interface AutoResponse {
  id: string;
  trigger: string;
  response: string;
  isActive: boolean;
  conditions: string[];
  delay?: number;
  usage: number;
}

export interface Invoice {
  id: string;
  subscriberId: string;
  taskId?: string; // معرف المهمة
  taskTitle?: string; // اسم المهمة
  amount: number;
  actualCost?: number; // التكلفة الفعلية
  commission?: number; // العمولة الخاصة
  description: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  dueDate: string;
  paidAt?: string;
  startDate?: string; // تاريخ البداية
  endDate?: string; // تاريخ الانتهاء
  clientPaymentMethod?: string; // طريقة دفع العميل
  commissionReceivedMethod?: string; // طريقة استلام العمولة
}

export interface BotStats {
  totalSubscribers: number;
  activeSubscribers: number;
  totalCommands: number;
  activeTasks: number;
  totalRevenue: number;
  monthlyRevenue: number;
  commandUsage: number;
  taskCompletion: number;
}

export interface BotSettings {
  botToken: string;
  botUsername: string;
  webhookUrl: string;
  isConnected: boolean;
  lastSync: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  language: Language;
}

export interface Notification {
  id: string;
  type: 'task_completed' | 'new_subscriber' | 'payment_received' | 'system' | 'task_accepted' | 'technician_message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'admin';
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'admin';
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface PasswordResetRequest {
  email: string;
  token: string;
  expiresAt: string;
  used: boolean;
}

// Telegram API Types
export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  date: number;
  chat: TelegramChat;
  text?: string;
  reply_markup?: any;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: {
    id: string;
    from: TelegramUser;
    message: TelegramMessage;
    data: string;
  };
}

export interface TelegramResponse {
  ok: boolean;
  result: any;
  description?: string;
}

// Translation Types
export interface Translations {
  [key: string]: {
    ar: string;
    de: string;
  };
}
