import React, { useState, useEffect } from 'react';
import { useBotContext } from '../context/BotContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';
import { 
  Search, 
  Users, 
  UserCheck,
  UserX,
  DollarSign,
  Calendar,
  Activity,
  Filter,
  Download,
  MapPin,
  Wrench,
  Edit,
  Save,
  X,
  Trash2,
  CheckSquare,
  Square,
  MoreVertical,
  AlertTriangle,
  UserMinus,
  RefreshCw,
  Shield,
  Database,
  Zap,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { format } from 'date-fns';

const SubscribersManager: React.FC = () => {
  const { subscribers, updateSubscriber, deleteSubscriber, exportReports, addNotification } = useBotContext();
  const { language, direction, textAlign } = useLanguage();
  const { t } = useTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [professionFilter, setProfessionFilter] = useState<'all' | 'technician' | 'craftsman'>('all');
  const [editingTechnician, setEditingTechnician] = useState<string | null>(null);
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<'disable' | 'permanent'>('disable');
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [showDuplicatesModal, setShowDuplicatesModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    profession: '',
    isActive: true
  });

  // البحث عن البيانات المكررة عند تحميل المكون
  useEffect(() => {
    findDuplicates();
  }, [subscribers]);

  const findDuplicates = () => {
    const duplicateGroups: any[] = [];
    const processed = new Set();

    subscribers.forEach((subscriber, index) => {
      if (processed.has(subscriber.id)) return;

      // البحث عن المكررات بناءً على userId أو username
      const duplicatesForThisUser = subscribers.filter((other, otherIndex) => 
        otherIndex !== index && 
        (other.userId === subscriber.userId || 
         other.username === subscriber.username ||
         (other.firstName === subscriber.firstName && other.lastName === subscriber.lastName))
      );

      if (duplicatesForThisUser.length > 0) {
        const group = [subscriber, ...duplicatesForThisUser];
        duplicateGroups.push(group);
        
        // إضافة جميع المكررات للمعالجة
        group.forEach(dup => processed.add(dup.id));
      }
    });

    setDuplicates(duplicateGroups);
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      subscriber.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subscriber.lastName && subscriber.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (subscriber.profession && subscriber.profession.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && subscriber.isActive) ||
      (statusFilter === 'inactive' && !subscriber.isActive);

    const matchesProfession = 
      professionFilter === 'all' ||
      (professionFilter === 'technician' && subscriber.profession === 'فني') ||
      (professionFilter === 'craftsman' && subscriber.profession === 'حرفي');
    
    return matchesSearch && matchesStatus && matchesProfession;
  });

  const activeSubscribers = subscribers.filter(s => s.isActive).length;
  const totalEarnings = subscribers.reduce((sum, s) => sum + s.totalEarnings, 0);
  const totalTasks = subscribers.reduce((sum, s) => sum + s.tasksCompleted, 0);

  // التحكم في التحديد
  const handleSelectTechnician = (technicianId: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(technicianId) 
        ? prev.filter(id => id !== technicianId)
        : [...prev, technicianId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTechnicians.length === filteredSubscribers.length) {
      setSelectedTechnicians([]);
    } else {
      setSelectedTechnicians(filteredSubscribers.map(s => s.id));
    }
  };

  // العمليات الجماعية
  const handleBulkActivate = () => {
    selectedTechnicians.forEach(id => {
      updateSubscriber(id, { isActive: true });
    });
    
    addNotification({
      type: 'system',
      title: '✅ ' + (language === 'ar' ? 'تم تفعيل الفنيين' : 'Techniker aktiviert'),
      message: language === 'ar' 
        ? `تم تفعيل ${selectedTechnicians.length} فني بنجاح`
        : `${selectedTechnicians.length} Techniker erfolgreich aktiviert`
    });
    
    setSelectedTechnicians([]);
    setShowBulkActions(false);
  };

  const handleBulkDeactivate = () => {
    selectedTechnicians.forEach(id => {
      updateSubscriber(id, { isActive: false });
    });
    
    addNotification({
      type: 'system',
      title: '⏸️ ' + (language === 'ar' ? 'تم إلغاء تفعيل الفنيين' : 'Techniker deaktiviert'),
      message: language === 'ar'
        ? `تم إلغاء تفعيل ${selectedTechnicians.length} فني بنجاح`
        : `${selectedTechnicians.length} Techniker erfolgreich deaktiviert`
    });
    
    setSelectedTechnicians([]);
    setShowBulkActions(false);
  };

  const handleBulkDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmBulkDelete = () => {
    if (deleteType === 'permanent') {
      // حذف نهائي
      selectedTechnicians.forEach(id => {
        deleteSubscriber(id);
      });
      
      addNotification({
        type: 'system',
        title: '🗑️ ' + (language === 'ar' ? 'تم الحذف النهائي' : 'Dauerhaft gelöscht'),
        message: language === 'ar'
          ? `تم حذف ${selectedTechnicians.length} فني نهائياً من قاعدة البيانات`
          : `${selectedTechnicians.length} Techniker dauerhaft aus der Datenbank gelöscht`
      });
    } else {
      // تعطيل فقط
      selectedTechnicians.forEach(id => {
        updateSubscriber(id, { isActive: false });
      });
      
      addNotification({
        type: 'system',
        title: '⏸️ ' + (language === 'ar' ? 'تم تعطيل الفنيين' : 'Techniker deaktiviert'),
        message: language === 'ar'
          ? `تم تعطيل ${selectedTechnicians.length} فني (يمكن إعادة تفعيلهم لاحقاً)`
          : `${selectedTechnicians.length} Techniker deaktiviert (können später reaktiviert werden)`
      });
    }
    
    setSelectedTechnicians([]);
    setShowBulkActions(false);
    setShowDeleteConfirm(false);
  };

  // حذف البيانات المكررة
  const handleRemoveDuplicates = () => {
    let removedCount = 0;
    
    duplicates.forEach(group => {
      // الاحتفاظ بأول عنصر وحذف الباقي
      const [keep, ...toRemove] = group.sort((a: any, b: any) => 
        new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
      );
      
      toRemove.forEach((duplicate: any) => {
        deleteSubscriber(duplicate.id);
        removedCount++;
      });
    });
    
    addNotification({
      type: 'system',
      title: '🧹 ' + (language === 'ar' ? 'تم إزالة البيانات المكررة' : 'Duplikate entfernt'),
      message: language === 'ar'
        ? `تم حذف ${removedCount} سجل مكرر. تم الاحتفاظ بأقدم سجل لكل فني.`
        : `${removedCount} doppelte Einträge gelöscht. Der älteste Eintrag für jeden Techniker wurde beibehalten.`
    });
    
    setShowDuplicatesModal(false);
    findDuplicates(); // إعادة فحص المكررات
  };

  // حذف فني محدد بـ ID
  const handleDeleteSpecificUser = (userId: string) => {
    const targetUsers = subscribers.filter(s => s.userId === userId);
    
    if (targetUsers.length > 1) {
      // إذا كان هناك أكثر من مستخدم بنفس الـ ID، احذف الأحدث
      const sortedUsers = targetUsers.sort((a, b) => 
        new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
      );
      
      // حذف جميع النسخ عدا الأولى
      sortedUsers.slice(1).forEach(user => {
        deleteSubscriber(user.id);
      });
      
      addNotification({
        type: 'system',
        title: '🗑️ ' + (language === 'ar' ? 'تم حذف المكررات' : 'Duplikate gelöscht'),
        message: language === 'ar'
          ? `تم حذف ${sortedUsers.length - 1} نسخة مكررة للمستخدم ${userId}`
          : `${sortedUsers.length - 1} doppelte Kopien für Benutzer ${userId} gelöscht`
      });
    } else if (targetUsers.length === 1) {
      deleteSubscriber(targetUsers[0].id);
      
      addNotification({
        type: 'system',
        title: '🗑️ ' + (language === 'ar' ? 'تم حذف المستخدم' : 'Benutzer gelöscht'),
        message: language === 'ar'
          ? `تم حذف المستخدم ${userId} نهائياً`
          : `Benutzer ${userId} dauerhaft gelöscht`
      });
    }
  };

  // التعديل الفردي
  const handleEditTechnician = (technician: any) => {
    setEditingTechnician(technician.id);
    setEditForm({
      firstName: technician.firstName,
      lastName: technician.lastName || '',
      profession: technician.profession || 'فني',
      isActive: technician.isActive
    });
  };

  const handleSaveEdit = () => {
    if (editingTechnician) {
      updateSubscriber(editingTechnician, editForm);
      setEditingTechnician(null);
      resetEditForm();
    }
  };

  const handleCancelEdit = () => {
    setEditingTechnician(null);
    resetEditForm();
  };

  const resetEditForm = () => {
    setEditForm({
      firstName: '',
      lastName: '',
      profession: '',
      isActive: true
    });
  };

  const handleExport = () => {
    exportReports('technicians', '30d');
  };

  const getProfessionIcon = (profession?: string) => {
    if (profession === 'فني') return <Wrench className="text-blue-400\" size={16} />;
    if (profession === 'حرفي') return <Activity className="text-orange-400\" size={16} />;
    return <Users className="text-gray-400" size={16} />;
  };

  // زر واحد للتفعيل/إلغاء التفعيل
  const toggleTechnicianStatus = (id: string, currentStatus: boolean) => {
    updateSubscriber(id, { isActive: !currentStatus });
    
    addNotification({
      type: 'system',
      title: !currentStatus ? '✅ ' + t('activate') : '⏸️ ' + t('deactivate'),
      message: language === 'ar'
        ? `تم ${!currentStatus ? 'تفعيل' : 'إلغاء تفعيل'} الفني بنجاح`
        : `Techniker erfolgreich ${!currentStatus ? 'aktiviert' : 'deaktiviert'}`
    });
  };

  const handleSingleDelete = (technicianId: string, permanent: boolean = false) => {
    if (permanent) {
      deleteSubscriber(technicianId);
      addNotification({
        type: 'system',
        title: '🗑️ ' + (language === 'ar' ? 'حذف نهائي' : 'Dauerhaft gelöscht'),
        message: language === 'ar'
          ? 'تم حذف الفني نهائياً من قاعدة البيانات'
          : 'Techniker dauerhaft aus der Datenbank gelöscht'
      });
    } else {
      updateSubscriber(technicianId, { isActive: false });
      addNotification({
        type: 'system',
        title: '⏸️ ' + (language === 'ar' ? 'تم تعطيل الفني' : 'Techniker deaktiviert'),
        message: language === 'ar'
          ? 'تم تعطيل الفني (يمكن إعادة تفعيله لاحقاً)'
          : 'Techniker deaktiviert (kann später reaktiviert werden)'
      });
    }
  };

  return (
    <div className="space-y-6" dir={direction}>
      <div className="flex items-center justify-between">
        <div style={{ textAlign }}>
          <h2 className="text-2xl font-bold">{t('techniciansManagement')}</h2>
          <p className="text-gray-400">{t('monitorManageTechnicians')}</p>
        </div>
        <div className="flex items-center gap-3">
          {duplicates.length > 0 && (
            <button
              onClick={() => setShowDuplicatesModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-colors"
            >
              <Database size={20} />
              {language === 'ar' ? 'إزالة المكررات' : 'Duplikate entfernen'} ({duplicates.reduce((sum, group) => sum + group.length - 1, 0)})
            </button>
          )}
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            <Download size={20} />
            {t('exportData')}
          </button>
        </div>
      </div>

      {/* Statistics Cards - تم حذف التقييم */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="text-blue-400" size={20} />
            </div>
            <div style={{ textAlign }}>
              <p className="text-gray-400 text-sm">{t('totalTechnicians')}</p>
              <p className="text-xl font-bold">{subscribers.length}</p>
              {duplicates.length > 0 && (
                <p className="text-xs text-yellow-400">
                  {duplicates.reduce((sum, group) => sum + group.length - 1, 0)} {language === 'ar' ? 'مكرر' : 'Duplikate'}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <UserCheck className="text-green-400" size={20} />
            </div>
            <div style={{ textAlign }}>
              <p className="text-gray-400 text-sm">{t('activeTechnicians')}</p>
              <p className="text-xl font-bold">{activeSubscribers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <DollarSign className="text-emerald-400" size={20} />
            </div>
            <div style={{ textAlign }}>
              <p className="text-gray-400 text-sm">{t('totalEarnings')}</p>
              <p className="text-xl font-bold">{totalEarnings.toLocaleString()} {t('riyal')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {/* شريط البحث والفلاتر */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} />
            <input
              type="text"
              placeholder={t('searchTechnicians')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${direction === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              style={{ textAlign }}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ textAlign }}
            >
              <option value="all">{t('allStatuses')}</option>
              <option value="active">{t('activeTechnicians')}</option>
              <option value="inactive">{language === 'ar' ? 'غير النشطين' : 'Inaktive'}</option>
            </select>
          </div>

          <select
            value={professionFilter}
            onChange={(e) => setProfessionFilter(e.target.value as 'all' | 'technician' | 'craftsman')}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ textAlign }}
          >
            <option value="all">{t('allProfessions')}</option>
            <option value="technician">{t('technician')}</option>
            <option value="craftsman">{t('craftsman')}</option>
          </select>
        </div>

        {/* شريط العمليات الجماعية */}
        {selectedTechnicians.length > 0 && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckSquare className="text-indigo-400" size={20} />
                <span className="text-indigo-400 font-medium">
                  {language === 'ar' 
                    ? `تم تحديد ${selectedTechnicians.length} فني`
                    : `${selectedTechnicians.length} Techniker ausgewählt`
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkActivate}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition-colors"
                >
                  <UserCheck size={16} />
                  {language === 'ar' ? 'تفعيل الكل' : 'Alle aktivieren'}
                </button>
                <button
                  onClick={handleBulkDeactivate}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm transition-colors"
                >
                  <UserX size={16} />
                  {language === 'ar' ? 'إلغاء التفعيل' : 'Deaktivieren'}
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition-colors"
                >
                  <Trash2 size={16} />
                  {language === 'ar' ? 'حذف المحدد' : 'Ausgewählte löschen'}
                </button>
                <button
                  onClick={() => setSelectedTechnicians([])}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                >
                  <X size={16} />
                  {language === 'ar' ? 'إلغاء التحديد' : 'Auswahl aufheben'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-right py-3 px-4 font-medium text-gray-300">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {selectedTechnicians.length === filteredSubscribers.length && filteredSubscribers.length > 0 ? (
                      <CheckSquare size={16} className="text-indigo-400" />
                    ) : (
                      <Square size={16} />
                    )}
                    {language === 'ar' ? 'تحديد الكل' : 'Alle auswählen'}
                  </button>
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-300" style={{ textAlign }}>{t('technicianName')}</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300" style={{ textAlign }}>{t('username')}</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300" style={{ textAlign }}>{t('telegramId')}</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300" style={{ textAlign }}>{t('profession')}</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300" style={{ textAlign }}>{t('joinDate')}</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300" style={{ textAlign }}>{t('completedTasks')}</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300" style={{ textAlign }}>{t('totalEarnings')}</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300" style={{ textAlign }}>{t('status')}</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300" style={{ textAlign }}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((subscriber) => {
                const isDuplicate = duplicates.some(group => 
                  group.some((dup: any) => dup.id === subscriber.id)
                );
                
                return (
                  <tr key={subscriber.id} className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                    isDuplicate ? 'bg-yellow-500/5 border-l-2 border-yellow-500' : ''
                  }`}>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleSelectTechnician(subscriber.id)}
                        className="text-gray-400 hover:text-indigo-400 transition-colors"
                      >
                        {selectedTechnicians.includes(subscriber.id) ? (
                          <CheckSquare size={16} className="text-indigo-400" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      {editingTechnician === subscriber.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                            className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                            placeholder={language === 'ar' ? 'الاسم الأول' : 'Vorname'}
                            style={{ textAlign }}
                          />
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                            className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                            placeholder={language === 'ar' ? 'الاسم الأخير' : 'Nachname'}
                            style={{ textAlign }}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {subscriber.firstName.charAt(0)}
                            </span>
                          </div>
                          <div style={{ textAlign }}>
                            <p className="font-medium text-white">
                              {subscriber.firstName} {subscriber.lastName}
                              {isDuplicate && (
                                <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-1 py-0.5 rounded">
                                  {language === 'ar' ? 'مكرر' : 'Duplikat'}
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-400">ID: {subscriber.id}</p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">@{subscriber.username}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 font-mono text-sm">{subscriber.userId}</span>
                        {subscriber.userId === '6459142184' && (
                          <button
                            onClick={() => handleDeleteSpecificUser(subscriber.userId)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title={language === 'ar' ? 'حذف هذا المستخدم المكرر' : 'Diesen doppelten Benutzer löschen'}
                          >
                            <Zap size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {editingTechnician === subscriber.id ? (
                        <select
                          value={editForm.profession}
                          onChange={(e) => setEditForm({...editForm, profession: e.target.value})}
                          className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                          style={{ textAlign }}
                        >
                          <option value="فني">{t('technician')}</option>
                          <option value="حرفي">{t('craftsman')}</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getProfessionIcon(subscriber.profession)}
                          <span className="text-gray-300">{subscriber.profession || (language === 'ar' ? 'غير محدد' : 'Unbestimmt')}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-gray-300">
                        <Calendar size={14} className="text-gray-500" />
                        <span>{format(new Date(subscriber.joinedAt), 'dd/MM/yyyy')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{subscriber.tasksCompleted}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-emerald-400 font-medium">
                        {subscriber.totalEarnings.toLocaleString()} {t('riyal')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {/* زر واحد للتفعيل/إلغاء التفعيل */}
                      <button
                        onClick={() => toggleTechnicianStatus(subscriber.id, subscriber.isActive)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        title={subscriber.isActive ? t('deactivate') : t('activate')}
                      >
                        {subscriber.isActive ? (
                          <ToggleRight size={20} className="text-green-500" />
                        ) : (
                          <ToggleLeft size={20} className="text-gray-500" />
                        )}
                        <span className={`text-xs ${subscriber.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                          {subscriber.isActive ? t('active') : (language === 'ar' ? 'غير نشط' : 'Inaktiv')}
                        </span>
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      {editingTechnician === subscriber.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title={t('save')}
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title={t('cancel')}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditTechnician(subscriber)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title={t('edit')}
                          >
                            <Edit size={16} />
                          </button>
                          <div className="relative group">
                            <button className="text-red-400 hover:text-red-300 transition-colors">
                              <MoreVertical size={16} />
                            </button>
                            <div className="absolute left-0 top-6 bg-gray-700 border border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <button
                                onClick={() => handleSingleDelete(subscriber.id, false)}
                                className="block w-full text-right px-3 py-2 text-yellow-400 hover:bg-gray-600 transition-colors text-sm"
                              >
                                {language === 'ar' ? 'تعطيل' : 'Deaktivieren'}
                              </button>
                              <button
                                onClick={() => handleSingleDelete(subscriber.id, true)}
                                className="block w-full text-right px-3 py-2 text-red-400 hover:bg-gray-600 transition-colors text-sm"
                              >
                                {language === 'ar' ? 'حذف نهائي' : 'Dauerhaft löschen'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredSubscribers.length === 0 && (
          <div className="text-center py-8">
            <Users size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">{language === 'ar' ? 'لا توجد فنيين تطابق المعايير المحددة' : 'Keine Techniker entsprechen den angegebenen Kriterien'}</p>
          </div>
        )}
      </div>

      {/* مودال إزالة البيانات المكررة */}
      {showDuplicatesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl border border-gray-700 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-yellow-400" size={24} />
              <h3 className="text-lg font-semibold text-white" style={{ textAlign }}>
                {language === 'ar' ? 'البيانات المكررة' : 'Doppelte Daten'}
              </h3>
            </div>
            
            <p className="text-gray-300 mb-6" style={{ textAlign }}>
              {language === 'ar' 
                ? `تم العثور على ${duplicates.length} مجموعة من البيانات المكررة. سيتم الاحتفاظ بأقدم سجل وحذف الباقي.`
                : `${duplicates.length} Gruppen doppelter Daten gefunden. Der älteste Eintrag wird beibehalten und der Rest gelöscht.`
              }
            </p>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
              {duplicates.map((group, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2" style={{ textAlign }}>
                    {language === 'ar' ? 'مجموعة' : 'Gruppe'} {index + 1}: {group[0].firstName} {group[0].lastName}
                  </h4>
                  <div className="space-y-2">
                    {group.map((duplicate: any, dupIndex: number) => (
                      <div key={duplicate.id} className={`flex items-center justify-between p-2 rounded ${
                        dupIndex === 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm ${dupIndex === 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {dupIndex === 0 
                              ? (language === 'ar' ? '✅ سيتم الاحتفاظ' : '✅ Wird beibehalten')
                              : (language === 'ar' ? '🗑️ سيتم الحذف' : '🗑️ Wird gelöscht')
                            }
                          </span>
                          <span className="text-gray-300">
                            @{duplicate.username} - ID: {duplicate.userId}
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {format(new Date(duplicate.joinedAt), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleRemoveDuplicates}
                className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-colors"
              >
                {language === 'ar' ? 'إزالة البيانات المكررة' : 'Doppelte Daten entfernen'}
              </button>
              <button
                onClick={() => setShowDuplicatesModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال تأكيد الحذف المتقدم */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-400" size={24} />
              <h3 className="text-lg font-semibold text-white" style={{ textAlign }}>
                {language === 'ar' ? 'اختر نوع الحذف' : 'Löschtyp auswählen'}
              </h3>
            </div>
            
            <p className="text-gray-300 mb-6" style={{ textAlign }}>
              {language === 'ar' 
                ? `تم تحديد ${selectedTechnicians.length} فني. اختر نوع العملية:`
                : `${selectedTechnicians.length} Techniker ausgewählt. Wählen Sie den Operationstyp:`
              }
            </p>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="deleteType"
                  value="disable"
                  checked={deleteType === 'disable'}
                  onChange={(e) => setDeleteType(e.target.value as 'disable' | 'permanent')}
                  className="text-yellow-500"
                />
                <div style={{ textAlign }}>
                  <div className="flex items-center gap-2">
                    <UserX className="text-yellow-400" size={16} />
                    <span className="text-white font-medium">
                      {language === 'ar' ? 'تعطيل (موصى به)' : 'Deaktivieren (empfohlen)'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {language === 'ar' 
                      ? 'إلغاء تفعيل الفنيين مع الاحتفاظ ببياناتهم'
                      : 'Techniker deaktivieren und ihre Daten behalten'
                    }
                  </p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="deleteType"
                  value="permanent"
                  checked={deleteType === 'permanent'}
                  onChange={(e) => setDeleteType(e.target.value as 'disable' | 'permanent')}
                  className="text-red-500"
                />
                <div style={{ textAlign }}>
                  <div className="flex items-center gap-2">
                    <Trash2 className="text-red-400" size={16} />
                    <span className="text-white font-medium">
                      {language === 'ar' ? 'حذف نهائي' : 'Dauerhaft löschen'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {language === 'ar' 
                      ? 'حذف نهائي من قاعدة البيانات (لا يمكن التراجع)'
                      : 'Dauerhaft aus der Datenbank löschen (nicht rückgängig machbar)'
                    }
                  </p>
                </div>
              </label>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={confirmBulkDelete}
                className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                  deleteType === 'permanent' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {deleteType === 'permanent' 
                  ? (language === 'ar' ? 'حذف نهائي' : 'Dauerhaft löschen')
                  : (language === 'ar' ? 'تعطيل' : 'Deaktivieren')
                }
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscribersManager;
