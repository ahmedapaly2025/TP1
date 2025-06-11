import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  CheckSquare,
  Clock,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Send,
  User,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  MoreVertical,
  Navigation,
  RotateCcw
} from 'lucide-react';
import { Task } from '../types';
import { format } from 'date-fns';

const TasksManager: React.FC = () => {
  const { tasks, subscribers, addTask, updateTask, deleteTask, sendTaskToTechnician, sendLocationToTechnician } = useBotContext();
  const { language, direction, textAlign } = useLanguage();
  const { t } = useTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'individual' as 'individual' | 'group',
    targetUsers: [] as string[],
    expectedCost: 0,
    startDate: '',
    endDate: '',
    deadline: '',
    status: 'active' as 'active' | 'completed' | 'expired',
    createdBy: 'admin',
    assignedTechnician: '',
    locationUrl: '',
    autoSendLocation: false,
  });

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeTechnicians = subscribers.filter(sub => sub.isActive);

  const handleAddTask = () => {
    if (newTask.title && newTask.description && newTask.expectedCost && newTask.startDate && newTask.endDate) {
      let taskData;
      
      if (newTask.type === 'group') {
        taskData = {
          ...newTask,
          deadline: newTask.endDate,
          targetUsers: activeTechnicians.map(tech => tech.id),
          assignedTechnician: '',
        };
      } else {
        taskData = {
          ...newTask,
          deadline: newTask.endDate,
          targetUsers: newTask.targetUsers.length > 0 ? newTask.targetUsers : [],
        };
      }
      
      addTask(taskData);
      resetForm();
      setShowAddModal(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      type: task.type,
      targetUsers: task.targetUsers,
      expectedCost: task.expectedCost,
      startDate: task.startDate,
      endDate: task.endDate,
      deadline: task.deadline,
      status: task.status,
      createdBy: task.createdBy,
      assignedTechnician: task.assignedTechnician || '',
      locationUrl: task.locationUrl || '',
      autoSendLocation: task.autoSendLocation || false,
    });
    setShowAddModal(true);
  };

  const handleUpdateTask = () => {
    if (editingTask && newTask.title && newTask.description && newTask.expectedCost && newTask.startDate && newTask.endDate) {
      let taskData;
      
      if (newTask.type === 'group') {
        taskData = {
          ...newTask,
          deadline: newTask.endDate,
          targetUsers: activeTechnicians.map(tech => tech.id),
          assignedTechnician: '',
        };
      } else {
        taskData = {
          ...newTask,
          deadline: newTask.endDate,
          targetUsers: newTask.targetUsers.length > 0 ? newTask.targetUsers : [],
        };
      }
      
      updateTask(editingTask.id, taskData);
      resetForm();
      setEditingTask(null);
      setShowAddModal(false);
    }
  };

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      type: 'individual',
      targetUsers: [],
      expectedCost: 0,
      startDate: '',
      endDate: '',
      deadline: '',
      status: 'active',
      createdBy: 'admin',
      assignedTechnician: '',
      locationUrl: '',
      autoSendLocation: false,
    });
  };

  const handleSendTaskToTechnician = (taskId: string, forceResend: boolean = false) => {
    sendTaskToTechnician(taskId, forceResend);
  };

  const handleSendLocationToTechnician = (taskId: string, forceResend: boolean = false) => {
    sendLocationToTechnician(taskId, forceResend);
  };

  const changeTaskStatus = (taskId: string, newStatus: 'active' | 'completed' | 'expired') => {
    updateTask(taskId, { status: newStatus });
    setShowStatusMenu(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400';
      case 'expired':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('active');
      case 'completed':
        return t('completed');
      case 'expired':
        return t('expired');
      default:
        return language === 'ar' ? 'غير محدد' : 'Unbestimmt';
    }
  };

  const getTechnicianName = (technicianId: string) => {
    const technician = subscribers.find(sub => sub.id === technicianId);
    return technician ? `${technician.firstName} ${technician.lastName}` : (language === 'ar' ? 'غير محدد' : 'Unbestimmt');
  };

  const handleTechnicianSelection = (technicianId: string, isSelected: boolean) => {
    if (isSelected) {
      setNewTask({
        ...newTask,
        targetUsers: [...newTask.targetUsers, technicianId]
      });
    } else {
      setNewTask({
        ...newTask,
        targetUsers: newTask.targetUsers.filter(id => id !== technicianId)
      });
    }
  };

  return (
    <div className="space-y-6" dir={direction}>
      <div className="flex items-center justify-between">
        <div style={{ textAlign }}>
          <h2 className="text-2xl font-bold">{t('tasksManagement')}</h2>
          <p className="text-gray-400">{t('createAssignTasks')}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
        >
          <Plus size={20} />
          {t('addNewTask')}
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} />
            <input
              type="text"
              placeholder={t('searchTasks')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${direction === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              style={{ textAlign }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-gray-700 rounded-lg p-5 border border-gray-600 hover:border-gray-500 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare size={16} className="text-indigo-400" />
                  <h4 className="font-semibold text-white" style={{ textAlign }}>{task.title}</h4>
                </div>
                <div className="flex items-center gap-1">
                  {/* زر إرسال المهمة للفنيين مع إعادة الإرسال */}
                  <div className="relative group">
                    <button
                      className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-gray-600"
                      title={t('sendTaskToTechnicians')}
                    >
                      <Send size={16} />
                    </button>
                    <div className="absolute top-8 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[140px]">
                      <button
                        onClick={() => handleSendTaskToTechnician(task.id, false)}
                        className="block w-full text-right px-3 py-2 text-blue-400 hover:bg-gray-700 rounded text-sm transition-colors"
                      >
                        📤 إرسال عادي
                      </button>
                      <button
                        onClick={() => handleSendTaskToTechnician(task.id, true)}
                        className="block w-full text-right px-3 py-2 text-green-400 hover:bg-gray-700 rounded text-sm transition-colors"
                      >
                        🔄 إعادة إرسال
                      </button>
                    </div>
                  </div>
                  
                  {/* زر إرسال الموقع مع إعادة الإرسال */}
                  <div className="relative group">
                    <button
                      className={`transition-colors p-1 rounded hover:bg-gray-600 ${
                        task.locationUrl 
                          ? 'text-gray-400 hover:text-green-400' 
                          : 'text-gray-600 hover:text-gray-500'
                      }`}
                      title={task.locationUrl ? t('sendLocation') : (language === 'ar' ? 'لا يوجد موقع محدد' : 'Kein Standort festgelegt')}
                      disabled={!task.locationUrl}
                    >
                      <Navigation size={16} />
                    </button>
                    {task.locationUrl && (
                      <div className="absolute top-8 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[140px]">
                        <button
                          onClick={() => handleSendLocationToTechnician(task.id, false)}
                          className="block w-full text-right px-3 py-2 text-green-400 hover:bg-gray-700 rounded text-sm transition-colors"
                        >
                          📍 إرسال موقع
                        </button>
                        <button
                          onClick={() => handleSendLocationToTechnician(task.id, true)}
                          className="block w-full text-right px-3 py-2 text-yellow-400 hover:bg-gray-700 rounded text-sm transition-colors"
                        >
                          🔄 إعادة إرسال
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* زر تغيير الحالة */}
                  <div className="relative">
                    <button
                      onClick={() => setShowStatusMenu(showStatusMenu === task.id ? null : task.id)}
                      className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-gray-600"
                      title={t('changeStatus')}
                    >
                      <RefreshCw size={16} />
                    </button>
                    
                    {showStatusMenu === task.id && (
                      <div className="absolute top-8 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-2 z-10 min-w-[120px]">
                        <button
                          onClick={() => changeTaskStatus(task.id, 'active')}
                          className="block w-full text-right px-3 py-2 text-green-400 hover:bg-gray-700 rounded text-sm transition-colors"
                        >
                          {t('active')}
                        </button>
                        <button
                          onClick={() => changeTaskStatus(task.id, 'completed')}
                          className="block w-full text-right px-3 py-2 text-blue-400 hover:bg-gray-700 rounded text-sm transition-colors"
                        >
                          {t('completed')}
                        </button>
                        <button
                          onClick={() => changeTaskStatus(task.id, 'expired')}
                          className="block w-full text-right px-3 py-2 text-red-400 hover:bg-gray-700 rounded text-sm transition-colors"
                        >
                          {t('expired')}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-gray-600"
                    title={t('edit')}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-gray-600"
                    title={t('delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-4" style={{ textAlign }}>{task.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={14} className="text-emerald-400" />
                  <span className="text-gray-300">{task.expectedCost} {t('riyal')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-blue-400" />
                  <span className="text-gray-300">
                    {task.type === 'individual' ? t('individual') : t('group')}
                    {task.type === 'group' && ` (${activeTechnicians.length} ${language === 'ar' ? 'فني' : 'Techniker'})`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-purple-400" />
                  <span className="text-gray-300">{format(new Date(task.startDate), 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-red-400" />
                  <span className="text-gray-300">{format(new Date(task.endDate), 'dd/MM/yyyy')}</span>
                </div>
              </div>

              {task.type === 'individual' && task.targetUsers.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <User size={14} className="text-yellow-400" />
                    <span className="text-gray-300">{language === 'ar' ? 'الفنيين المختارين:' : 'Ausgewählte Techniker:'}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {task.targetUsers.map(userId => getTechnicianName(userId)).join(', ')}
                  </div>
                </div>
              )}

              {task.type === 'group' && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={14} className="text-blue-400" />
                    <span className="text-gray-300">{language === 'ar' ? 'مهمة جماعية - جميع الفنيين النشطين' : 'Gruppenaufgabe - alle aktiven Techniker'}</span>
                  </div>
                </div>
              )}

              {task.acceptedBy && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckSquare size={14} className="text-green-400" />
                    <span className="text-gray-300">{language === 'ar' ? 'قبلها:' : 'Angenommen von:'} {getTechnicianName(task.acceptedBy)}</span>
                  </div>
                </div>
              )}

              {task.locationUrl && (
                <div className="flex items-center gap-2 text-sm mb-2">
                  <MapPin size={14} className="text-green-400" />
                  <span className="text-gray-300">{language === 'ar' ? 'يحتوي على موقع جغرافي' : 'Enthält geografischen Standort'}</span>
                  {task.autoSendLocation && (
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">{language === 'ar' ? 'تلقائي' : 'Automatisch'}</span>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>{format(new Date(task.createdAt), 'dd/MM/yyyy')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Click outside to close status menu */}
      {showStatusMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowStatusMenu(null)}
        />
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4\" style={{ textAlign }}>
              {editingTask ? (language === 'ar' ? 'تعديل المهمة' : 'Aufgabe bearbeiten') : t('addNewTask')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1" style={{ textAlign }}>{t('taskTitle')}</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder={language === 'ar' ? 'عنوان المهمة' : 'Aufgabentitel'}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textAlign }}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1" style={{ textAlign }}>{t('taskDescription')}</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder={language === 'ar' ? 'وصف المهمة' : 'Aufgabenbeschreibung'}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textAlign }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" style={{ textAlign }}>{t('taskType')}</label>
                <select
                  value={newTask.type}
                  onChange={(e) => {
                    const newType = e.target.value as 'individual' | 'group';
                    setNewTask({ 
                      ...newTask, 
                      type: newType,
                      targetUsers: newType === 'group' ? [] : newTask.targetUsers
                    });
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textAlign }}
                >
                  <option value="individual">{t('individual')}</option>
                  <option value="group">{t('group')} ({language === 'ar' ? 'إرسال لجميع الفنيين تلقائياً' : 'Automatisch an alle Techniker senden'})</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" style={{ textAlign }}>{t('expectedCost')} ({t('riyal')})</label>
                <input
                  type="number"
                  value={newTask.expectedCost}
                  onChange={(e) => setNewTask({ ...newTask, expectedCost: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textAlign: 'left', direction: 'ltr' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" style={{ textAlign }}>{t('startDate')}</label>
                <input
                  type="datetime-local"
                  value={newTask.startDate}
                  onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" style={{ textAlign }}>{t('endDate')}</label>
                <input
                  type="datetime-local"
                  value={newTask.endDate}
                  onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {newTask.type === 'individual' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                    {t('selectTechnicians')}
                  </label>
                  <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {activeTechnicians.map((technician) => (
                      <div key={technician.id} className="flex items-center gap-3 py-2">
                        <input
                          type="checkbox"
                          id={`tech-${technician.id}`}
                          checked={newTask.targetUsers.includes(technician.id)}
                          onChange={(e) => handleTechnicianSelection(technician.id, e.target.checked)}
                          className="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={`tech-${technician.id}`} className="text-gray-300 text-sm cursor-pointer flex-1" style={{ textAlign }}>
                          {technician.firstName} {technician.lastName} - {technician.profession || (language === 'ar' ? 'غير محدد' : 'Unbestimmt')} ({technician.specialization || (language === 'ar' ? 'عام' : 'Allgemein')})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newTask.type === 'group' && (
                <div className="md:col-span-2">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm" style={{ textAlign }}>
                      📢 <strong>{t('groupTask')}:</strong> {t('groupTaskDescription')} ({activeTechnicians.length} {language === 'ar' ? 'فني' : 'Techniker'})
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" style={{ textAlign }}>{t('status')}</label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value as 'active' | 'completed' | 'expired' })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textAlign }}
                >
                  <option value="active">{t('active')}</option>
                  <option value="completed">{t('completed')}</option>
                  <option value="expired">{t('expired')}</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1" style={{ textAlign }}>{t('locationUrl')}</label>
                <input
                  type="url"
                  value={newTask.locationUrl}
                  onChange={(e) => setNewTask({ ...newTask, locationUrl: e.target.value })}
                  placeholder={t('locationUrlPlaceholder')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textAlign: 'left', direction: 'ltr' }}
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoSendLocation"
                  checked={newTask.autoSendLocation}
                  onChange={(e) => setNewTask({ ...newTask, autoSendLocation: e.target.checked })}
                  className="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="autoSendLocation" className="text-sm text-gray-300" style={{ textAlign }}>
                  {t('autoSendLocation')}
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingTask ? handleUpdateTask : handleAddTask}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
              >
                {editingTask ? t('update') : t('add')}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTask(null);
                  resetForm();
                }}
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

export default TasksManager;
