import { Language } from '../types';

export const translations = {
  // Navigation
  dashboard: {
    ar: 'لوحة التحكم',
    de: 'Dashboard'
  },
  tasks: {
    ar: 'إدارة المهام',
    de: 'Aufgabenverwaltung'
  },
  technicians: {
    ar: 'الفنيين',
    de: 'Techniker'
  },
  invoices: {
    ar: 'الفواتير',
    de: 'Rechnungen'
  },
  reports: {
    ar: 'التقارير التفصيلية',
    de: 'Detaillierte Berichte'
  },
  analytics: {
    ar: 'التحليلات المتقدمة',
    de: 'Erweiterte Analytics'
  },
  logs: {
    ar: 'سجل النشاطات',
    de: 'Aktivitätsprotokolle'
  },
  settings: {
    ar: 'الإعدادات',
    de: 'Einstellungen'
  },

  // Admin Profile
  adminProfile: {
    ar: 'الملف الشخصي للأدمن',
    de: 'Admin-Profil'
  },
  fullName: {
    ar: 'الاسم الكامل',
    de: 'Vollständiger Name'
  },
  email: {
    ar: 'البريد الإلكتروني',
    de: 'E-Mail'
  },
  username: {
    ar: 'اسم المستخدم',
    de: 'Benutzername'
  },
  currentPassword: {
    ar: 'كلمة المرور الحالية',
    de: 'Aktuelles Passwort'
  },
  newPassword: {
    ar: 'كلمة المرور الجديدة',
    de: 'Neues Passwort'
  },
  confirmPassword: {
    ar: 'تأكيد كلمة المرور',
    de: 'Passwort bestätigen'
  },
  forgotPassword: {
    ar: 'نسيت كلمة المرور؟',
    de: 'Passwort vergessen?'
  },
  resetPassword: {
    ar: 'إعادة تعيين كلمة المرور',
    de: 'Passwort zurücksetzen'
  },
  sendResetEmail: {
    ar: 'إرسال رابط الاستعادة',
    de: 'Reset-Link senden'
  },
  updateProfile: {
    ar: 'تحديث الملف الشخصي',
    de: 'Profil aktualisieren'
  },
  changePassword: {
    ar: 'تغيير كلمة المرور',
    de: 'Passwort ändern'
  },

  // Common Actions
  add: {
    ar: 'إضافة',
    de: 'Hinzufügen'
  },
  edit: {
    ar: 'تعديل',
    de: 'Bearbeiten'
  },
  delete: {
    ar: 'حذف',
    de: 'Löschen'
  },
  save: {
    ar: 'حفظ',
    de: 'Speichern'
  },
  cancel: {
    ar: 'إلغاء',
    de: 'Abbrechen'
  },
  search: {
    ar: 'البحث',
    de: 'Suchen'
  },
  export: {
    ar: 'تصدير',
    de: 'Exportieren'
  },
  print: {
    ar: 'طباعة',
    de: 'Drucken'
  },
  send: {
    ar: 'إرسال',
    de: 'Senden'
  },
  
  // Bot Status
  botConnected: {
    ar: 'البوت متصل ✅',
    de: 'Bot verbunden ✅'
  },
  botDisconnected: {
    ar: 'البوت غير متصل ❌',
    de: 'Bot nicht verbunden ❌'
  },
  receivingMessages: {
    ar: 'يستقبل الرسائل',
    de: 'Empfängt Nachrichten'
  },
  stopped: {
    ar: 'متوقف',
    de: 'Gestoppt'
  },

  // Task Management
  newTask: {
    ar: 'مهمة جديدة',
    de: 'Neue Aufgabe'
  },
  taskTitle: {
    ar: 'عنوان المهمة',
    de: 'Aufgabentitel'
  },
  taskDescription: {
    ar: 'وصف المهمة',
    de: 'Aufgabenbeschreibung'
  },
  expectedCost: {
    ar: 'التكلفة المتوقعة',
    de: 'Erwartete Kosten'
  },
  startDate: {
    ar: 'تاريخ البداية',
    de: 'Startdatum'
  },
  endDate: {
    ar: 'تاريخ الانتهاء',
    de: 'Enddatum'
  },
  individual: {
    ar: 'فردية',
    de: 'Einzeln'
  },
  group: {
    ar: 'جماعية',
    de: 'Gruppe'
  },
  active: {
    ar: 'نشطة',
    de: 'Aktiv'
  },
  completed: {
    ar: 'مكتملة',
    de: 'Abgeschlossen'
  },
  expired: {
    ar: 'منتهية',
    de: 'Abgelaufen'
  },

  // Technician Management
  totalTechnicians: {
    ar: 'إجمالي الفنيين',
    de: 'Gesamte Techniker'
  },
  activeTechnicians: {
    ar: 'الفنيين النشطين',
    de: 'Aktive Techniker'
  },
  technicianName: {
    ar: 'اسم الفني',
    de: 'Techniker Name'
  },
  profession: {
    ar: 'المهنة',
    de: 'Beruf'
  },
  specialization: {
    ar: 'التخصص',
    de: 'Spezialisierung'
  },
  rating: {
    ar: 'التقييم',
    de: 'Bewertung'
  },
  joinDate: {
    ar: 'تاريخ الانضمام',
    de: 'Beitrittsdatum'
  },
  completedTasks: {
    ar: 'المهام المكتملة',
    de: 'Abgeschlossene Aufgaben'
  },
  totalEarnings: {
    ar: 'إجمالي الأرباح',
    de: 'Gesamteinnahmen'
  },

  // Bot Responses - Updated with new format

  taskAccepted: {
    ar: 'تم قبول المهمة',
    de: 'Aufgabe angenommen'
  },
  taskRejected: {
    ar: 'تم رفض المهمة',
    de: 'Aufgabe abgelehnt'
  },
  sendLocation: {
    ar: 'إرسال الموقع',
    de: 'Standort senden'
  },
  locationSent: {
    ar: 'تم إرسال الموقع',
    de: 'Standort gesendet'
  },

  // Settings
  language: {
    ar: 'اللغة',
    de: 'Sprache'
  },
  arabic: {
    ar: 'العربية',
    de: 'Arabisch'
  },
  german: {
    ar: 'الألمانية',
    de: 'Deutsch'
  },
  botToken: {
    ar: 'رمز البوت',
    de: 'Bot Token'
  },
  botUsername: {
    ar: 'اسم البوت',
    de: 'Bot Benutzername'
  },
  testConnection: {
    ar: 'اختبار الاتصال',
    de: 'Verbindung testen'
  },
  startReceiving: {
    ar: 'بدء الاستقبال',
    de: 'Empfang starten'
  },
  stopReceiving: {
    ar: 'إيقاف الاستقبال',
    de: 'Empfang stoppen'
  },

  // Notifications
  newTechnicianJoined: {
    ar: 'فني جديد انضم!',
    de: 'Neuer Techniker beigetreten!'
  },
  taskSent: {
    ar: 'تم إرسال المهمة',
    de: 'Aufgabe gesendet'
  },
  invoiceCreated: {
    ar: 'تم إنشاء فاتورة جديدة',
    de: 'Neue Rechnung erstellt'
  },

  // Financial
  amount: {
    ar: 'المبلغ',
    de: 'Betrag'
  },
  actualCost: {
    ar: 'التكلفة الفعلية',
    de: 'Tatsächliche Kosten'
  },
  commission: {
    ar: 'العمولة',
    de: 'Provision'
  },
  pending: {
    ar: 'معلقة',
    de: 'Ausstehend'
  },
  paid: {
    ar: 'مدفوعة',
    de: 'Bezahlt'
  },
  cancelled: {
    ar: 'ملغية',
    de: 'Storniert'
  },
  visa: {
    ar: 'فيزا',
    de: 'Visa'
  },
  transfer: {
    ar: 'تحويل',
    de: 'Überweisung'
  },
  cash: {
    ar: 'كاش',
    de: 'Bar'
  },

  // Common Phrases
  riyal: {
    ar: 'ريال',
    de: 'Riyal'
  },
  currency: {
    ar: 'ريال',
    de: 'Riyal'
  },
  yes: {
    ar: 'نعم',
    de: 'Ja'
  },
  no: {
    ar: 'لا',
    de: 'Nein'
  },
  loading: {
    ar: 'جاري التحميل...',
    de: 'Wird geladen...'
  },
  success: {
    ar: 'نجح',
    de: 'Erfolgreich'
  },
  error: {
    ar: 'خطأ',
    de: 'Fehler'
  },
  warning: {
    ar: 'تحذير',
    de: 'Warnung'
  },
  info: {
    ar: 'معلومات',
    de: 'Information'
  },

  // Validation Messages
  required: {
    ar: 'هذا الحقل مطلوب',
    de: 'Dieses Feld ist erforderlich'
  },
  invalidEmail: {
    ar: 'البريد الإلكتروني غير صحيح',
    de: 'Ungültige E-Mail-Adresse'
  },
  passwordMismatch: {
    ar: 'كلمات المرور غير متطابقة',
    de: 'Passwörter stimmen nicht überein'
  },
  passwordTooShort: {
    ar: 'كلمة المرور قصيرة جداً (8 أحرف على الأقل)',
    de: 'Passwort zu kurz (mindestens 8 Zeichen)'
  },
  profileUpdated: {
    ar: 'تم تحديث الملف الشخصي بنجاح',
    de: 'Profil erfolgreich aktualisiert'
  },
  passwordChanged: {
    ar: 'تم تغيير كلمة المرور بنجاح',
    de: 'Passwort erfolgreich geändert'
  },
  resetEmailSent: {
    ar: 'تم إرسال رابط الاستعادة إلى بريدك الإلكتروني',
    de: 'Reset-Link wurde an Ihre E-Mail gesendet'
  },

  // Dashboard Content
  overview: {
    ar: 'نظرة عامة',
    de: 'Übersicht'
  },
  comprehensiveStats: {
    ar: 'إحصائيات شاملة حول أداء البوت والفنيين',
    de: 'Umfassende Statistiken über Bot-Leistung und Techniker'
  },
  financialStats: {
    ar: 'الإحصائيات المالية',
    de: 'Finanzstatistiken'
  },
  trackRevenue: {
    ar: 'تتبع الإيرادات والمدفوعات',
    de: 'Einnahmen und Zahlungen verfolgen'
  },
  revenueGrowth: {
    ar: 'نمو الإيرادات',
    de: 'Umsatzwachstum'
  },
  technicianGrowth: {
    ar: 'نمو الفنيين',
    de: 'Techniker-Wachstum'
  },
  commandUsage: {
    ar: 'استخدام الأوامر',
    de: 'Befehlsverwendung'
  },
  taskCompletion: {
    ar: 'إنجاز المهام',
    de: 'Aufgabenabschluss'
  },
  taskDistribution: {
    ar: 'توزيع المهام',
    de: 'Aufgabenverteilung'
  },
  systemStatus: {
    ar: 'حالة النظام',
    de: 'Systemstatus'
  },
  botStatus: {
    ar: 'حالة البوت',
    de: 'Bot-Status'
  },
  connected: {
    ar: 'متصل',
    de: 'Verbunden'
  },
  disconnected: {
    ar: 'غير متصل',
    de: 'Nicht verbunden'
  },
  readyToWork: {
    ar: 'جاهز للعمل',
    de: 'Arbeitsbereit'
  },
  needsConnection: {
    ar: 'يجب ربط البوت من الإعدادات',
    de: 'Bot muss in den Einstellungen verbunden werden'
  },
  monthlyRevenue: {
    ar: 'الإيرادات الشهرية',
    de: 'Monatliche Einnahmen'
  },
  totalCommands: {
    ar: 'إجمالي الأوامر',
    de: 'Gesamte Befehle'
  },
  activeTasks: {
    ar: 'المهام النشطة',
    de: 'Aktive Aufgaben'
  },
  taskCompletionRate: {
    ar: 'معدل إنجاز المهام',
    de: 'Aufgabenabschlussrate'
  },
  averageEarningsPerUser: {
    ar: 'متوسط الأرباح لكل مستخدم',
    de: 'Durchschnittliche Einnahmen pro Benutzer'
  },

  // Settings Content
  systemSettings: {
    ar: 'إعدادات النظام وربط البوت (Polling فقط - لا webhook)',
    de: 'Systemeinstellungen und Bot-Verbindung (nur Polling - kein Webhook)'
  },
  interfaceLanguage: {
    ar: 'اختيار لغة الواجهة',
    de: 'Sprache der Benutzeroberfläche auswählen'
  },
  arabicDefault: {
    ar: 'العربية (افتراضي)',
    de: 'Arabisch (Standard)'
  },
  botConfiguration: {
    ar: 'إعدادات البوت',
    de: 'Bot-Einstellungen'
  },
  connectTelegramBot: {
    ar: 'ربط وإعداد بوت التليجرام (Polling فقط)',
    de: 'Telegram-Bot verbinden und konfigurieren (nur Polling)'
  },
  getBotTokenFromBotFather: {
    ar: 'احصل على الرمز من @BotFather في التليجرام',
    de: 'Token von @BotFather in Telegram erhalten'
  },
  messageReceiving: {
    ar: 'استقبال الرسائل',
    de: 'Nachrichten empfangen'
  },
  controlTelegramMessages: {
    ar: 'التحكم في استقبال رسائل التليجرام (Polling فقط)',
    de: 'Telegram-Nachrichten empfangen (nur Polling)'
  },
  receivingStatus: {
    ar: 'حالة الاستقبال',
    de: 'Empfangsstatus'
  },
  receivingFromTelegram: {
    ar: 'يستقبل الرسائل من التليجرام (Polling)',
    de: 'Empfängt Nachrichten von Telegram (Polling)'
  },
  receptionStopped: {
    ar: 'متوقف عن الاستقبال',
    de: 'Empfang gestoppt'
  },
  botReceivingNow: {
    ar: 'البوت يستقبل الرسائل الآن! 🚀',
    de: 'Bot empfängt jetzt Nachrichten! 🚀'
  },
  testSystemInstructions: {
    ar: 'أرسل /start من رقم آخر في التليجرام لاختبار النظام',
    de: 'Sende /start von einer anderen Nummer in Telegram, um das System zu testen'
  },
  mustConnectBotFirst: {
    ar: 'يجب الاتصال بالبوت أولاً',
    de: 'Bot muss zuerst verbunden werden'
  },
  notificationSettings: {
    ar: 'إعدادات الإشعارات',
    de: 'Benachrichtigungseinstellungen'
  },
  customizeNotifications: {
    ar: 'تخصيص الإشعارات والأصوات',
    de: 'Benachrichtigungen und Töne anpassen'
  },
  notifications: {
    ar: 'الإشعارات',
    de: 'Benachrichtigungen'
  },
  enableSystemNotifications: {
    ar: 'تفعيل إشعارات النظام',
    de: 'Systembenachrichtigungen aktivieren'
  },
  sounds: {
    ar: 'الأصوات',
    de: 'Töne'
  },
  playNotificationSounds: {
    ar: 'تشغيل أصوات الإشعارات',
    de: 'Benachrichtigungstöne abspielen'
  },

  // Tasks Manager
  tasksManagement: {
    ar: 'إدارة المهام',
    de: 'Aufgabenverwaltung'
  },
  createAssignTasks: {
    ar: 'إنشاء وتوجيه المهام للفنيين والحرفيين',
    de: 'Aufgaben für Techniker und Handwerker erstellen und zuweisen'
  },
  addNewTask: {
    ar: 'إضافة مهمة جديدة',
    de: 'Neue Aufgabe hinzufügen'
  },
  searchTasks: {
    ar: 'البحث في المهام...',
    de: 'Aufgaben suchen...'
  },
  taskType: {
    ar: 'نوع المهمة',
    de: 'Aufgabentyp'
  },
  targetTechnicians: {
    ar: 'الفنيين المستهدفين',
    de: 'Ziel-Techniker'
  },
  selectTechnicians: {
    ar: 'اختيار الفنيين (يمكن اختيار أكثر من واحد)',
    de: 'Techniker auswählen (mehrere möglich)'
  },
  groupTask: {
    ar: 'مهمة جماعية',
    de: 'Gruppenaufgabe'
  },
  groupTaskDescription: {
    ar: 'سيتم إرسال هذه المهمة تلقائياً لجميع الفنيين النشطين',
    de: 'Diese Aufgabe wird automatisch an alle aktiven Techniker gesendet'
  },
  locationUrl: {
    ar: 'رابط خريطة الموقع (Google Maps)',
    de: 'Standort-Link (Google Maps)'
  },
  locationUrlPlaceholder: {
    ar: 'https://maps.google.com/...',
    de: 'https://maps.google.com/...'
  },
  autoSendLocation: {
    ar: 'إرسال الموقع تلقائياً عند قبول المهمة',
    de: 'Standort automatisch bei Aufgabenannahme senden'
  },
  sendTaskToTechnicians: {
    ar: 'إرسال المهمة للفنيين',
    de: 'Aufgabe an Techniker senden'
  },
  changeStatus: {
    ar: 'تغيير الحالة',
    de: 'Status ändern'
  },

  // Subscribers Manager
  techniciansManagement: {
    ar: 'إدارة الفنيين',
    de: 'Techniker-Verwaltung'
  },
  monitorManageTechnicians: {
    ar: 'متابعة وإدارة الفنيين في البوت',
    de: 'Techniker im Bot überwachen und verwalten'
  },
  exportData: {
    ar: 'تصدير البيانات',
    de: 'Daten exportieren'
  },
  searchTechnicians: {
    ar: 'البحث في الفنيين...',
    de: 'Techniker suchen...'
  },
  allStatuses: {
    ar: 'جميع الحالات',
    de: 'Alle Status'
  },
  allProfessions: {
    ar: 'جميع المهن',
    de: 'Alle Berufe'
  },
  technician: {
    ar: 'فني',
    de: 'Techniker'
  },
  craftsman: {
    ar: 'حرفي',
    de: 'Handwerker'
  },
  telegramId: {
    ar: 'Telegram ID',
    de: 'Telegram ID'
  },
  lastActivity: {
    ar: 'آخر نشاط',
    de: 'Letzte Aktivität'
  },
  activate: {
    ar: 'تفعيل',
    de: 'Aktivieren'
  },
  deactivate: {
    ar: 'إلغاء التفعيل',
    de: 'Deaktivieren'
  },

  // Invoices Manager
  invoicesManagement: {
    ar: 'إدارة الفواتير',
    de: 'Rechnungsverwaltung'
  },
  createTrackInvoices: {
    ar: 'إنشاء ومتابعة فواتير الفنيين',
    de: 'Techniker-Rechnungen erstellen und verfolgen'
  },
  createNewInvoice: {
    ar: 'إنشاء فاتورة جديدة',
    de: 'Neue Rechnung erstellen'
  },
  exportInvoices: {
    ar: 'تصدير الفواتير',
    de: 'Rechnungen exportieren'
  },
  totalInvoices: {
    ar: 'إجمالي الفواتير',
    de: 'Gesamte Rechnungen'
  },
  totalAmount: {
    ar: 'إجمالي المبلغ',
    de: 'Gesamtbetrag'
  },
  paidAmount: {
    ar: 'المبلغ المدفوع',
    de: 'Bezahlter Betrag'
  },
  totalCommissions: {
    ar: 'إجمالي العمولات',
    de: 'Gesamte Provisionen'
  },
  searchInvoices: {
    ar: 'البحث في الفواتير...',
    de: 'Rechnungen suchen...'
  },
  allInvoices: {
    ar: 'جميع الفواتير',
    de: 'Alle Rechnungen'
  },
  invoiceNumber: {
    ar: 'رقم الفاتورة',
    de: 'Rechnungsnummer'
  },
  task: {
    ar: 'المهمة',
    de: 'Aufgabe'
  },
  clientPaymentMethod: {
    ar: 'طريقة دفع العميل',
    de: 'Zahlungsmethode des Kunden'
  },
  commissionReceived: {
    ar: 'استلام العمولة',
    de: 'Provisionserhalt'
  },
  dueDate: {
    ar: 'تاريخ الاستحقاق',
    de: 'Fälligkeitsdatum'
  },
  selectTechnician: {
    ar: 'اختر الفني',
    de: 'Techniker auswählen'
  },
  selectTask: {
    ar: 'اختر المهمة (اختياري)',
    de: 'Aufgabe auswählen (optional)'
  },
  invoiceDescription: {
    ar: 'وصف الفاتورة',
    de: 'Rechnungsbeschreibung'
  },
  customCommission: {
    ar: 'العمولة الخاصة (ريال)',
    de: 'Spezielle Provision (Riyal)'
  },
  selectPaymentMethod: {
    ar: 'اختر طريقة الدفع',
    de: 'Zahlungsmethode auswählen'
  },
  otherPaymentMethod: {
    ar: 'طريقة دفع أخرى',
    de: 'Andere Zahlungsmethode'
  },
  writePaymentMethod: {
    ar: 'اكتب طريقة الدفع',
    de: 'Zahlungsmethode eingeben'
  },
  commissionReceivedVia: {
    ar: 'استلمنا العمولة عن طريق',
    de: 'Provision erhalten über'
  },
  selectReceiptMethod: {
    ar: 'اختر طريقة الاستلام',
    de: 'Empfangsmethode auswählen'
  },
  otherReceiptMethod: {
    ar: 'طريقة استلام أخرى',
    de: 'Andere Empfangsmethode'
  },
  writeReceiptMethod: {
    ar: 'اكتب طريقة الاستلام',
    de: 'Empfangsmethode eingeben'
  },
  createInvoice: {
    ar: 'إنشاء الفاتورة',
    de: 'Rechnung erstellen'
  },

  // Reports Manager
  detailedReports: {
    ar: 'التقارير التفصيلية',
    de: 'Detaillierte Berichte'
  },
  comprehensiveReports: {
    ar: 'تقارير شاملة حول أداء البوت والعمولات',
    de: 'Umfassende Berichte über Bot-Leistung und Provisionen'
  },
  exportReport: {
    ar: 'تصدير التقرير',
    de: 'Bericht exportieren'
  },
  reportType: {
    ar: 'نوع التقرير',
    de: 'Berichtstyp'
  },
  overviewReport: {
    ar: 'النظرة العامة',
    de: 'Übersichtsbericht'
  },
  techniciansReport: {
    ar: 'تقرير الفنيين',
    de: 'Techniker-Bericht'
  },
  tasksReport: {
    ar: 'تقرير المهام',
    de: 'Aufgaben-Bericht'
  },
  financialReport: {
    ar: 'التقرير المالي',
    de: 'Finanzbericht'
  },
  commandsReport: {
    ar: 'تقرير الأوامر',
    de: 'Befehls-Bericht'
  },
  assignedTasks: {
    ar: 'المهام الموكلة',
    de: 'Zugewiesene Aufgaben'
  },
  cancelledTasks: {
    ar: 'المهام الملغية',
    de: 'Abgebrochene Aufgaben'
  },
  averageCompletedTasks: {
    ar: 'متوسط المهام المكتملة',
    de: 'Durchschnittlich abgeschlossene Aufgaben'
  },
  averageEarnings: {
    ar: 'متوسط الأرباح',
    de: 'Durchschnittliche Einnahmen'
  },
  perTechnician: {
    ar: 'لكل فني',
    de: 'pro Techniker'
  },
  taskPerTechnician: {
    ar: 'مهمة لكل فني',
    de: 'Aufgabe pro Techniker'
  },
  detailedTechniciansReport: {
    ar: 'تقرير تفصيلي للفنيين',
    de: 'Detaillierter Techniker-Bericht'
  },
  detailedTasksReport: {
    ar: 'تقرير تفصيلي للمهام',
    de: 'Detaillierter Aufgaben-Bericht'
  },
  detailedInvoicesReport: {
    ar: 'تقرير تفصيلي للفواتير',
    de: 'Detaillierter Rechnungs-Bericht'
  },
  totalCosts: {
    ar: 'إجمالي التكاليف',
    de: 'Gesamtkosten'
  },
  assignedTechnicians: {
    ar: 'الفنيين المخصصين',
    de: 'Zugewiesene Techniker'
  },
  allTechnicians: {
    ar: 'جميع الفنيين',
    de: 'Alle Techniker'
  },
  acceptedBy: {
    ar: 'الفني المقبول',
    de: 'Angenommen von'
  },
  none: {
    ar: 'لا يوجد',
    de: 'Keine'
  },
  hasLocation: {
    ar: 'يحتوي على موقع',
    de: 'Hat Standort'
  },
  autoSend: {
    ar: 'الإرسال التلقائي',
    de: 'Automatisches Senden'
  },
  paymentStatus: {
    ar: 'حالة الدفع',
    de: 'Zahlungsstatus'
  },
  creationDate: {
    ar: 'تاريخ الإنشاء',
    de: 'Erstellungsdatum'
  },

  // Analytics Manager
  advancedAnalytics: {
    ar: 'التحليلات المتقدمة',
    de: 'Erweiterte Analytics'
  },
  comprehensiveAnalysis: {
    ar: 'تحليل شامل لأداء النظام والمستخدمين',
    de: 'Umfassende Analyse der System- und Benutzerleistung'
  },
  exportAnalytics: {
    ar: 'تصدير التحليلات',
    de: 'Analytics exportieren'
  },
  analysisType: {
    ar: 'نوع التحليل',
    de: 'Analyse-Typ'
  },
  generalPerformance: {
    ar: 'الأداء العام',
    de: 'Allgemeine Leistung'
  },
  engagement: {
    ar: 'التفاعل',
    de: 'Engagement'
  },
  revenue: {
    ar: 'الإيرادات',
    de: 'Einnahmen'
  },
  growth: {
    ar: 'النمو',
    de: 'Wachstum'
  },
  taskCompletionRate2: {
    ar: 'معدل إنجاز المهام',
    de: 'Aufgabenabschlussrate'
  },
  averageResponseTime: {
    ar: 'متوسط وقت الاستجابة',
    de: 'Durchschnittliche Antwortzeit'
  },
  retentionRate: {
    ar: 'معدل الاحتفاظ',
    de: 'Bindungsrate'
  },
  dailyEngagementRate: {
    ar: 'معدل التفاعل اليومي',
    de: 'Tägliche Engagement-Rate'
  },
  averageSessions: {
    ar: 'متوسط الجلسات',
    de: 'Durchschnittliche Sitzungen'
  },
  sessionTime: {
    ar: 'وقت الجلسة',
    de: 'Sitzungszeit'
  },
  fromYesterday: {
    ar: 'من الأمس',
    de: 'von gestern'
  },
  fromLastWeek: {
    ar: 'من الأسبوع الماضي',
    de: 'von letzter Woche'
  },
  fromLastMonth: {
    ar: 'من الشهر الماضي',
    de: 'von letztem Monat'
  },
  averageDailyRevenue: {
    ar: 'متوسط الإيرادات اليومية',
    de: 'Durchschnittliche Tageseinnahmen'
  },
  profitMargin: {
    ar: 'هامش الربح',
    de: 'Gewinnmarge'
  },
  monthlyGrowthRate: {
    ar: 'معدل النمو الشهري',
    de: 'Monatliche Wachstumsrate'
  },
  newTechniciansThisMonth: {
    ar: 'فنيين جدد هذا الشهر',
    de: 'Neue Techniker diesen Monat'
  },
  cancellationRate: {
    ar: 'معدل الإلغاء',
    de: 'Stornierungsrate'
  },
  userActivity: {
    ar: 'نشاط المستخدمين',
    de: 'Benutzeraktivität'
  },
  userEngagement: {
    ar: 'تفاعل المستخدمين',
    de: 'Benutzer-Engagement'
  },
  activityDistribution: {
    ar: 'توزيع الأنشطة',
    de: 'Aktivitätsverteilung'
  },

  // Logs Manager
  activityLogs: {
    ar: 'سجل النشاطات',
    de: 'Aktivitätsprotokolle'
  },
  trackAllActivities: {
    ar: 'تتبع جميع الأنشطة والأحداث في النظام',
    de: 'Alle Aktivitäten und Ereignisse im System verfolgen'
  },
  exportLogs: {
    ar: 'تصدير السجل',
    de: 'Protokoll exportieren'
  },
  totalEvents: {
    ar: 'إجمالي الأحداث',
    de: 'Gesamte Ereignisse'
  },
  successfulOperations: {
    ar: 'العمليات الناجحة',
    de: 'Erfolgreiche Operationen'
  },
  warnings: {
    ar: 'التحذيرات',
    de: 'Warnungen'
  },
  errors: {
    ar: 'الأخطاء',
    de: 'Fehler'
  },
  searchLogs: {
    ar: 'البحث في السجل...',
    de: 'Protokoll durchsuchen...'
  },
  allLevels: {
    ar: 'جميع المستويات',
    de: 'Alle Ebenen'
  },
  allSources: {
    ar: 'جميع المصادر',
    de: 'Alle Quellen'
  },
  system: {
    ar: 'النظام',
    de: 'System'
  },
  telegram: {
    ar: 'تليجرام',
    de: 'Telegram'
  },
  user: {
    ar: 'مستخدم',
    de: 'Benutzer'
  },
  timestamp: {
    ar: 'التوقيت',
    de: 'Zeitstempel'
  },
  level: {
    ar: 'المستوى',
    de: 'Ebene'
  },
  source: {
    ar: 'المصدر',
    de: 'Quelle'
  },
  action: {
    ar: 'الإجراء',
    de: 'Aktion'
  },
  details: {
    ar: 'التفاصيل',
    de: 'Details'
  },
  noMatchingLogs: {
    ar: 'لا توجد سجلات تطابق المعايير المحددة',
    de: 'Keine Protokolle entsprechen den angegebenen Kriterien'
  },
  liveStatus: {
    ar: 'الحالة الحية',
    de: 'Live-Status'
  },
  working: {
    ar: 'يعمل',
    de: 'Funktioniert'
  },
  databaseConnected: {
    ar: 'قاعدة البيانات: متصلة',
    de: 'Datenbank: Verbunden'
  },

  // Bot Messages (updated with new format)
  taskAvailable: {
    ar: '📌 مهمة جديدة متاحة:\n\n🔧 {title}\n📝 {description}\n\n💰 التكلفة المتوقعة: {cost} ريال\n📅 تاريخ البداية: {startDate}\n⏰ تاريخ الانتهاء: {endDate}\n\n📝',
    de: '📌 Neue Aufgabe verfügbar:\n\n🔧 {title}\n📝 {description}\n\n💰 Erwartete Kosten: {cost} Riyal\n📅 Startdatum: {startDate}\n⏰ Enddatum: {endDate}\n\n📝 Zur Bestätigung des Auftrags, schreibe:\nAngenommen\n\n📝 '
  },
  taskAcceptedMessage: {
    ar: '✅ رائع! تم قبول المهمة بنجاح\n\n🔧 {title}\n💰 التكلفة: {cost} ريال\n\n📍 سيتم إرسال موقع المهمة قريباً من الإدارة.',
    de: '✅ Großartig! Aufgabe erfolgreich angenommen\n\n🔧 {title}\n💰 Kosten: {cost} Riyal\n\n📍 Der Aufgabenstandort wird bald von der Verwaltung gesendet.'
  },
  taskRejectedMessage: {
    ar: '❌ لا مشكلة!\n\n🔧 {title}\n\n💪 سنرسل لك مهمة أخرى قريباً!',
    de: '❌ Kein Problem!\n\n🔧 {title}\n\n💪 Wir senden Ihnen bald eine andere Aufgabe!'
  },
  locationMessage: {
    ar: '📍 موقع المهمة\n\n🔧 {title}\n📍 الموقع الجغرافي:\n{location}\n\n💡 اضغط على الرابط لفتح الموقع في خرائط جوجل.\n\n🚀 حظاً موفقاً في إنجاز المهمة!',
    de: '📍 Aufgabenstandort\n\n🔧 {title}\n📍 Geografischer Standort:\n{location}\n\n💡 Klicken Sie auf den Link, um den Standort in Google Maps zu öffnen.\n\n🚀 Viel Erfolg bei der Aufgabe!'
  },
  welcomeMessage: {
    ar: '🎉 أهلاً وسهلاً {name}!\n\n✅ تم تسجيلك بنجاح كفني في نظام إدارة المهام.\n\n🔧 ستصلك المهام الجديدة هنا مباشرة!\n\n📝',
    de: '🎉 Willkommen {name}!\n\n✅ Sie wurden erfolgreich als Techniker im Aufgabenverwaltungssystem registriert.\n\n🔧 Neue Aufgaben werden direkt hier gesendet!\n\n📝 Zur Bestätigung des Auftrags, schreibe:\nAngenommen\n\n📝'
  },
  welcomeBackMessage: {
    ar: '👋 مرحباً بعودتك {name}!\n\n✅ أنت مسجل بالفعل في النظام\n\n📝 ',
    de: '👋 Willkommen zurück {name}!\n\n✅ Sie wurden bereits erfolgreich im System registriert\n\n📝 Zur Bestätigung des Auftrags, schreibe:\nAngenommen\n\n📝 '
  }
};

export const useTranslation = (language: Language) => {
  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    let text = translation[language] || translation.ar || key;
    
    // Replace variables in text
    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
      });
    }
    
    return text;
  };

  return { t };
};

export const getDirection = (language: Language): 'rtl' | 'ltr' => {
  return language === 'ar' ? 'rtl' : 'ltr';
};

export const getTextAlign = (language: Language): 'right' | 'left' => {
  return language === 'ar' ? 'right' : 'left';
};
