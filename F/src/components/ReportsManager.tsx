import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { 
  Download, 
  FileText, 
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Filter,
  Eye,
  CheckSquare,
  XCircle,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  Wallet,
  Printer
} from 'lucide-react';
import AreaChartWidget from './charts/AreaChartWidget';
import BarChartWidget from './charts/BarChartWidget';
import LineChartWidget from './charts/LineChartWidget';
import PieChartWidget from './charts/PieChartWidget';
import { format } from 'date-fns';

const ReportsManager: React.FC = () => {
  const { stats, subscribers, tasks, invoices, commands, exportReports } = useBotContext();
  const [reportType, setReportType] = useState<'overview' | 'technicians' | 'tasks' | 'financial' | 'commands'>('overview');
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState<string | null>(null);

  const handleExportReport = (type: string) => {
    exportReports(type, '30d');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const getReportTypeName = (type: string) => {
    const names = {
      overview: 'النظرة العامة',
      technicians: 'الفنيين',
      tasks: 'المهام',
      financial: 'المالي',
      commands: 'الأوامر'
    };
    return names[type as keyof typeof names] || type;
  };

  const reportTypes = [
    { value: 'overview', label: 'النظرة العامة', icon: <BarChart3 size={16} /> },
    { value: 'technicians', label: 'تقرير الفنيين', icon: <Users size={16} /> },
    { value: 'tasks', label: 'تقرير المهام', icon: <FileText size={16} /> },
    { value: 'financial', label: 'التقرير المالي', icon: <DollarSign size={16} /> },
    { value: 'commands', label: 'تقرير الأوامر', icon: <TrendingUp size={16} /> },
  ];

  // حساب إحصائيات الفني
  const getTechnicianStats = (technicianId: string) => {
    const technicianTasks = tasks.filter(task => 
      task.targetUsers.includes(technicianId) || task.assignedTechnician === technicianId
    );
    const completedTasks = technicianTasks.filter(task => task.status === 'completed');
    const cancelledTasks = technicianTasks.filter(task => task.status === 'expired');
    const activeTasks = technicianTasks.filter(task => task.status === 'active');
    
    const technicianInvoices = invoices.filter(inv => inv.subscriberId === technicianId);
    const totalEarnings = technicianInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    
    return {
      assignedTasks: technicianTasks.length,
      completedTasks: completedTasks.length,
      cancelledTasks: cancelledTasks.length,
      activeTasks: activeTasks.length,
      totalEarnings,
      tasks: technicianTasks,
      invoices: technicianInvoices
    };
  };

  const getTaskDetails = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const taskInvoices = invoices.filter(inv => inv.taskId === taskId);
    return { task, invoices: taskInvoices };
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'visa':
        return <CreditCard size={14} className="text-blue-400" />;
      case 'transfer':
        return <Banknote size={14} className="text-green-400" />;
      case 'cash':
        return <Wallet size={14} className="text-yellow-400" />;
      default:
        return <FileText size={14} className="text-gray-400" />;
    }
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="text-blue-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">إجمالي الفنيين</p>
              <p className="text-xl font-bold">{stats.totalSubscribers.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="text-emerald-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">إجمالي الإيرادات من العمولات</p>
              <p className="text-xl font-bold">{stats.totalRevenue.toLocaleString()} ريال</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileText className="text-purple-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">المهام النشطة</p>
              <p className="text-xl font-bold">{stats.activeTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-orange-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">معدل الإنجاز</p>
              <p className="text-xl font-bold">{stats.taskCompletion}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartWidget title="نمو الإيرادات من العمولات" />
        <LineChartWidget title="نمو الفنيين" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BarChartWidget title="استخدام الأوامر" />
        <BarChartWidget title="إنجاز المهام" variant="horizontal" />
        <PieChartWidget title="توزيع المهام" />
      </div>
    </div>
  );

  const renderTechniciansReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">الفنيين النشطين</h4>
          <p className="text-2xl font-bold text-green-400">{subscribers.filter(s => s.isActive).length}</p>
          <p className="text-sm text-gray-400">من إجمالي {subscribers.length}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">متوسط المهام المكتملة</h4>
          <p className="text-2xl font-bold text-blue-400">
            {Math.round(subscribers.reduce((sum, s) => sum + s.tasksCompleted, 0) / subscribers.length)}
          </p>
          <p className="text-sm text-gray-400">مهمة لكل فني</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">متوسط الأرباح</h4>
          <p className="text-2xl font-bold text-emerald-400">
            {Math.round(subscribers.reduce((sum, s) => sum + s.totalEarnings, 0) / subscribers.length)} ريال
          </p>
          <p className="text-sm text-gray-400">لكل فني</p>
        </div>
      </div>

      {/* جدول تفصيلي للفنيين */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">تقرير تفصيلي للفنيين</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-right py-3 px-4 font-medium text-gray-300">اسم الفني</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">المهام الموكلة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">المهام المنجزة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">المهام الملغية</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">إجمالي الأرباح</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((technician) => {
                const stats = getTechnicianStats(technician.id);
                return (
                  <tr key={technician.id} className="border-b border-gray-600/50 hover:bg-gray-600/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {technician.firstName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {technician.firstName} {technician.lastName}
                          </p>
                          <p className="text-sm text-gray-400">{technician.profession} - {technician.specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{stats.assignedTasks}</td>
                    <td className="py-4 px-4 text-green-400">{stats.completedTasks}</td>
                    <td className="py-4 px-4 text-red-400">{stats.cancelledTasks}</td>
                    <td className="py-4 px-4 text-emerald-400 font-medium">
                      {stats.totalEarnings.toLocaleString()} ريال
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedTechnician(selectedTechnician === technician.id ? null : technician.id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* تفاصيل الفني المحدد */}
      {selectedTechnician && (
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              تفاصيل الفني: {subscribers.find(s => s.id === selectedTechnician)?.firstName} {subscribers.find(s => s.id === selectedTechnician)?.lastName}
            </h3>
            <button
              onClick={() => setSelectedTechnician(null)}
              className="text-gray-400 hover:text-white"
            >
              <XCircle size={20} />
            </button>
          </div>
          
          {(() => {
            const stats = getTechnicianStats(selectedTechnician);
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-600 rounded-lg p-3">
                    <p className="text-gray-400 text-sm">المهام النشطة</p>
                    <p className="text-lg font-bold text-yellow-400">{stats.activeTasks}</p>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-3">
                    <p className="text-gray-400 text-sm">المهام المكتملة</p>
                    <p className="text-lg font-bold text-green-400">{stats.completedTasks}</p>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-3">
                    <p className="text-gray-400 text-sm">المهام الملغية</p>
                    <p className="text-lg font-bold text-red-400">{stats.cancelledTasks}</p>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-3">
                    <p className="text-gray-400 text-sm">إجمالي الأرباح</p>
                    <p className="text-lg font-bold text-emerald-400">{stats.totalEarnings.toLocaleString()} ريال</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <h4 className="font-medium text-white mb-3">المهام المخصصة</h4>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-right py-2 px-3 font-medium text-gray-300">اسم المهمة</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-300">التاريخ</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-300">التكلفة</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-300">الحالة</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-300">تفاصيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.tasks.map((task) => (
                        <tr key={task.id} className="border-b border-gray-600/50">
                          <td className="py-3 px-3">
                            <button
                              onClick={() => setShowTaskDetails(showTaskDetails === task.id ? null : task.id)}
                              className="text-blue-400 hover:text-blue-300 transition-colors text-right"
                            >
                              {task.title}
                            </button>
                          </td>
                          <td className="py-3 px-3 text-gray-300 text-sm">
                            {format(new Date(task.startDate), 'dd/MM/yyyy')}
                          </td>
                          <td className="py-3 px-3 text-emerald-400">
                            {task.expectedCost} ريال
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              task.status === 'active' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {task.status === 'completed' ? 'مكتملة' : 
                               task.status === 'active' ? 'نشطة' : 'منتهية'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => setShowTaskDetails(showTaskDetails === task.id ? null : task.id)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* تفاصيل المهمة */}
      {showTaskDetails && (
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">تفاصيل المهمة</h3>
            <button
              onClick={() => setShowTaskDetails(null)}
              className="text-gray-400 hover:text-white"
            >
              <XCircle size={20} />
            </button>
          </div>
          
          {(() => {
            const { task, invoices: taskInvoices } = getTaskDetails(showTaskDetails);
            if (!task) return <p className="text-gray-400">المهمة غير موجودة</p>;
            
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">معلومات المهمة</h4>
                    <div className="bg-gray-600 rounded-lg p-4 space-y-2">
                      <p className="text-gray-300"><strong>العنوان:</strong> {task.title}</p>
                      <p className="text-gray-300"><strong>الوصف:</strong> {task.description}</p>
                      <p className="text-gray-300"><strong>تاريخ البداية:</strong> {format(new Date(task.startDate), 'dd/MM/yyyy HH:mm')}</p>
                      <p className="text-gray-300"><strong>تاريخ الانتهاء:</strong> {format(new Date(task.endDate), 'dd/MM/yyyy HH:mm')}</p>
                      <p className="text-gray-300"><strong>التكلفة المتوقعة:</strong> {task.expectedCost} ريال</p>
                      {task.locationUrl && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-green-400" />
                          <span className="text-gray-300">يحتوي على موقع جغرافي</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-white mb-2">معلومات الدفع</h4>
                    <div className="bg-gray-600 rounded-lg p-4 space-y-2">
                      {taskInvoices.length > 0 ? (
                        taskInvoices.map((invoice) => (
                          <div key={invoice.id} className="border-b border-gray-500 pb-2 last:border-b-0">
                            <p className="text-gray-300"><strong>تاريخ الفاتورة:</strong> {format(new Date(invoice.createdAt), 'dd/MM/yyyy')}</p>
                            <p className="text-gray-300"><strong>المبلغ:</strong> {invoice.amount} ريال</p>
                            {invoice.actualCost && (
                              <p className="text-gray-300"><strong>التكلفة الفعلية:</strong> {invoice.actualCost} ريال</p>
                            )}
                            {invoice.commission && (
                              <p className="text-gray-300"><strong>العمولة:</strong> {invoice.commission} ريال</p>
                            )}
                            {invoice.clientPaymentMethod && (
                              <div className="flex items-center gap-2">
                                {getPaymentMethodIcon(invoice.clientPaymentMethod)}
                                <span className="text-gray-300"><strong>طريقة دفع العميل:</strong> {invoice.clientPaymentMethod}</span>
                              </div>
                            )}
                            {invoice.commissionReceivedMethod && (
                              <div className="flex items-center gap-2">
                                {getPaymentMethodIcon(invoice.commissionReceivedMethod)}
                                <span className="text-gray-300"><strong>طريقة استلام العمولة:</strong> {invoice.commissionReceivedMethod}</span>
                              </div>
                            )}
                            <p className="text-gray-300">
                              <strong>حالة الدفع:</strong> 
                              <span className={`mr-2 px-2 py-1 rounded-full text-xs ${
                                invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                invoice.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {invoice.status === 'paid' ? 'مدفوعة' : 
                                 invoice.status === 'pending' ? 'معلقة' : 'ملغية'}
                              </span>
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">لا توجد فواتير لهذه المهمة</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <LineChartWidget title="نمو الفنيين" />
    </div>
  );

  const renderTasksReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">المهام النشطة</h4>
          <p className="text-2xl font-bold text-green-400">{tasks.filter(t => t.status === 'active').length}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">المهام المكتملة</h4>
          <p className="text-2xl font-bold text-blue-400">{tasks.filter(t => t.status === 'completed').length}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">إجمالي التكاليف</h4>
          <p className="text-2xl font-bold text-emerald-400">
            {tasks.reduce((sum, t) => sum + t.expectedCost, 0).toLocaleString()} ريال
          </p>
        </div>
      </div>

      {/* جدول تفصيلي للمهام */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">تقرير تفصيلي للمهام</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-right py-3 px-4 font-medium text-gray-300">اسم المهمة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">النوع</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">التاريخ</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">التكلفة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">الفنيين المخصصين</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">الحالة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">تفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-gray-600/50 hover:bg-gray-600/30 transition-colors">
                  <td className="py-4 px-4">
                    <button
                      onClick={() => setShowTaskDetails(showTaskDetails === task.id ? null : task.id)}
                      className="text-blue-400 hover:text-blue-300 transition-colors text-right font-medium"
                    >
                      {task.title}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {task.type === 'individual' ? 'فردية' : 'جماعية'}
                  </td>
                  <td className="py-4 px-4 text-gray-300 text-sm">
                    {format(new Date(task.startDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="py-4 px-4 text-emerald-400 font-medium">
                    {task.expectedCost} ريال
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {task.type === 'group' ? 'جميع الفنيين' : task.targetUsers.length}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      task.status === 'active' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {task.status === 'completed' ? 'مكتملة' : 
                       task.status === 'active' ? 'نشطة' : 'منتهية'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => setShowTaskDetails(showTaskDetails === task.id ? null : task.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BarChartWidget title="إنجاز المهام" />
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">إجمالي العمولات</h4>
          <p className="text-2xl font-bold text-blue-400">
            {invoices.reduce((sum, inv) => sum + (inv.commission || 0), 0).toLocaleString()} ريال
          </p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">العمولات المحصلة</h4>
          <p className="text-2xl font-bold text-green-400">
            {invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.commission || 0), 0).toLocaleString()} ريال
          </p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">العمولات المعلقة</h4>
          <p className="text-2xl font-bold text-yellow-400">
            {invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + (inv.commission || 0), 0).toLocaleString()} ريال
          </p>
        </div>
      </div>

      {/* جدول تفصيلي للفواتير */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">تقرير تفصيلي للفواتير</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-right py-3 px-4 font-medium text-gray-300">رقم الفاتورة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">الفني</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">المهمة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">المبلغ</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">التكلفة الفعلية</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">العمولة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">طريقة الدفع</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const technician = subscribers.find(s => s.id === invoice.subscriberId);
                return (
                  <tr key={invoice.id} className="border-b border-gray-600/50 hover:bg-gray-600/30 transition-colors">
                    <td className="py-4 px-4 text-indigo-400 font-mono">#{invoice.id}</td>
                    <td className="py-4 px-4 text-gray-300">
                      {technician ? `${technician.firstName} ${technician.lastName}` : 'غير محدد'}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {invoice.taskTitle || 'غير محدد'}
                    </td>
                    <td className="py-4 px-4 text-emerald-400 font-medium">
                      {invoice.amount.toLocaleString()} ريال
                    </td>
                    <td className="py-4 px-4 text-blue-400">
                      {invoice.actualCost ? `${invoice.actualCost.toLocaleString()} ريال` : '-'}
                    </td>
                    <td className="py-4 px-4 text-purple-400">
                      {invoice.commission ? `${invoice.commission.toLocaleString()} ريال` : '-'}
                    </td>
                    <td className="py-4 px-4">
                      {invoice.clientPaymentMethod ? (
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(invoice.clientPaymentMethod)}
                          <span className="text-gray-300 text-sm">{invoice.clientPaymentMethod}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                        invoice.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {invoice.status === 'paid' ? 'مدفوعة' : 
                         invoice.status === 'pending' ? 'معلقة' : 'ملغية'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AreaChartWidget title="نمو الإيرادات من العمولات" />
    </div>
  );

  const renderCommandsReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">إجمالي الأوامر</h4>
          <p className="text-2xl font-bold text-blue-400">{commands.length}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">الأوامر النشطة</h4>
          <p className="text-2xl font-bold text-green-400">{commands.filter(c => c.isActive).length}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">إجمالي الاستخدام</h4>
          <p className="text-2xl font-bold text-purple-400">
            {commands.reduce((sum, c) => sum + c.usage, 0).toLocaleString()}
          </p>
        </div>
      </div>
      <BarChartWidget title="استخدام الأوامر" />
    </div>
  );

  const renderReportContent = () => {
    switch (reportType) {
      case 'technicians':
        return renderTechniciansReport();
      case 'tasks':
        return renderTasksReport();
      case 'financial':
        return renderFinancialReport();
      case 'commands':
        return renderCommandsReport();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">التقارير التفصيلية</h2>
          <p className="text-gray-400">تقارير شاملة حول أداء البوت والعمولات</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
          >
            <Printer size={20} />
            طباعة
          </button>
          <button
            onClick={() => handleExportReport(reportType)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            <Download size={20} />
            تصدير التقرير
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-gray-300 text-sm">نوع التقرير:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setReportType(type.value as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  reportType === type.value
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

        {renderReportContent()}
      </div>
    </div>
  );
};

export default ReportsManager;
