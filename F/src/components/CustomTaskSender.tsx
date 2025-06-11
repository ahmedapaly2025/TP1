import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Send, 
  Users, 
  MessageSquare, 
  X, 
  CheckSquare,
  Square,
  Plus
} from 'lucide-react';

interface CustomTaskSenderProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomTaskSender: React.FC<CustomTaskSenderProps> = ({ isOpen, onClose }) => {
  const { subscribers, sendCustomTaskToTechnicians, sendDirectMessageToTechnician } = useBotContext();
  const { language, direction, textAlign } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'task' | 'message'>('task');
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  // Task form
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    cost: 0
  });
  
  // Message form
  const [messageForm, setMessageForm] = useState({
    message: ''
  });

  const activeTechnicians = subscribers.filter(s => s.isActive);

  const handleTechnicianSelection = (technicianId: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(technicianId) 
        ? prev.filter(id => id !== technicianId)
        : [...prev, technicianId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTechnicians.length === activeTechnicians.length) {
      setSelectedTechnicians([]);
    } else {
      setSelectedTechnicians(activeTechnicians.map(t => t.id));
    }
  };

  const handleSendTask = async () => {
    if (!taskForm.title || !taskForm.description || selectedTechnicians.length === 0) {
      alert(language === 'ar' ? 'يرجى ملء جميع الحقول واختيار فني واحد على الأقل' : 'Bitte füllen Sie alle Felder aus und wählen Sie mindestens einen Techniker');
      return;
    }

    setIsSending(true);
    
    try {
      const success = await sendCustomTaskToTechnicians(selectedTechnicians, taskForm);
      
      if (success) {
        // Reset form
        setTaskForm({ title: '', description: '', cost: 0 });
        setSelectedTechnicians([]);
        onClose();
        alert(language === 'ar' ? 'تم إرسال المهمة بنجاح!' : 'Aufgabe erfolgreich gesendet!');
      }
    } catch (error) {
      alert(language === 'ar' ? 'حدث خطأ في إرسال المهمة' : 'Fehler beim Senden der Aufgabe');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageForm.message || selectedTechnicians.length === 0) {
      alert(language === 'ar' ? 'يرجى كتابة الرسالة واختيار فني واحد على الأقل' : 'Bitte schreiben Sie eine Nachricht und wählen Sie mindestens einen Techniker');
      return;
    }

    setIsSending(true);
    
    try {
      let successCount = 0;
      
      for (const technicianId of selectedTechnicians) {
        const technician = subscribers.find(s => s.id === technicianId);
        if (technician) {
          const success = await sendDirectMessageToTechnician(technician.userId, messageForm.message);
          if (success) successCount++;
          
          // تأخير بين الرسائل
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (successCount > 0) {
        // Reset form
        setMessageForm({ message: '' });
        setSelectedTechnicians([]);
        onClose();
        alert(language === 'ar' 
          ? `تم إرسال الرسالة إلى ${successCount} فني بنجاح!`
          : `Nachricht erfolgreich an ${successCount} Techniker gesendet!`
        );
      }
    } catch (error) {
      alert(language === 'ar' ? 'حدث خطأ في إرسال الرسالة' : 'Fehler beim Senden der Nachricht');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir={direction}>
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white" style={{ textAlign }}>
            {language === 'ar' ? 'إرسال مخصص للفنيين' : 'Benutzerdefiniertes Senden an Techniker'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('task')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'task'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <CheckSquare size={16} />
              {language === 'ar' ? 'إرسال مهمة' : 'Aufgabe senden'}
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'message'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <MessageSquare size={16} />
              {language === 'ar' ? 'إرسال رسالة' : 'Nachricht senden'}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Technician Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-white" style={{ textAlign }}>
                {language === 'ar' ? 'اختيار الفنيين' : 'Techniker auswählen'}
              </h4>
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
              >
                {selectedTechnicians.length === activeTechnicians.length ? (
                  <CheckSquare size={16} />
                ) : (
                  <Square size={16} />
                )}
                {language === 'ar' ? 'تحديد الكل' : 'Alle auswählen'} ({activeTechnicians.length})
              </button>
            </div>
            
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 max-h-48 overflow-y-auto">
              {activeTechnicians.length === 0 ? (
                <p className="text-gray-400 text-center\" style={{ textAlign }}>
                  {language === 'ar' ? 'لا يوجد فنيين نشطين' : 'Keine aktiven Techniker'}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeTechnicians.map((technician) => (
                    <div key={technician.id} className="flex items-center gap-3 p-2 hover:bg-gray-600 rounded transition-colors">
                      <input
                        type="checkbox"
                        id={`tech-${technician.id}`}
                        checked={selectedTechnicians.includes(technician.id)}
                        onChange={() => handleTechnicianSelection(technician.id)}
                        className="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor={`tech-${technician.id}`} className="text-gray-300 text-sm cursor-pointer flex-1" style={{ textAlign }}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {technician.firstName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{technician.firstName} {technician.lastName}</p>
                            <p className="text-xs text-gray-400">{technician.profession || (language === 'ar' ? 'فني' : 'Techniker')}</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {selectedTechnicians.length > 0 && (
              <p className="text-sm text-indigo-400 mt-2" style={{ textAlign }}>
                {language === 'ar' 
                  ? `تم تحديد ${selectedTechnicians.length} فني`
                  : `${selectedTechnicians.length} Techniker ausgewählt`
                }
              </p>
            )}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'task' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                  {language === 'ar' ? 'عنوان المهمة' : 'Aufgabentitel'}
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder={language === 'ar' ? 'أدخل عنوان المهمة' : 'Aufgabentitel eingeben'}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textAlign }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                  {language === 'ar' ? 'وصف المهمة' : 'Aufgabenbeschreibung'}
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  placeholder={language === 'ar' ? 'أدخل وصف المهمة' : 'Aufgabenbeschreibung eingeben'}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textAlign }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                  {language === 'ar' ? 'التكلفة (ريال)' : 'Kosten (Riyal)'}
                </label>
                <input
                  type="number"
                  value={taskForm.cost}
                  onChange={(e) => setTaskForm({...taskForm, cost: Number(e.target.value)})}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textAlign: 'left', direction: 'ltr' }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" style={{ textAlign }}>
                  {language === 'ar' ? 'نص الرسالة' : 'Nachrichtentext'}
                </label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                  placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Schreiben Sie Ihre Nachricht hier...'}
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textAlign }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-700">
          <button
            onClick={activeTab === 'task' ? handleSendTask : handleSendMessage}
            disabled={isSending || selectedTechnicians.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 rounded-lg text-white transition-colors font-medium"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={20} />
            )}
            {isSending 
              ? (language === 'ar' ? 'جاري الإرسال...' : 'Wird gesendet...')
              : (language === 'ar' ? 'إرسال' : 'Senden')
            }
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors font-medium"
          >
            {language === 'ar' ? 'إلغاء' : 'Abbrechen'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTaskSender;
