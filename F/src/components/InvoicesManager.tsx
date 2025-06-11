import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { 
  Plus, 
  Search, 
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
  CreditCard,
  Banknote,
  Wallet,
  Printer,
  Send
} from 'lucide-react';
import { Invoice } from '../types';
import { format } from 'date-fns';

const InvoicesManager: React.FC = () => {
  const { invoices, subscribers, tasks, createInvoice, updateInvoice, exportInvoices, sendInvoiceToTechnician } = useBotContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    subscriberId: '',
    taskId: '',
    taskTitle: '',
    amount: 0,
    actualCost: 0,
    commission: 0,
    description: '',
    status: 'pending' as 'pending' | 'paid' | 'cancelled',
    dueDate: '',
    startDate: '',
    endDate: '',
    clientPaymentMethod: '',
    customClientPayment: '',
    commissionReceivedMethod: '',
    customCommissionReceived: '',
  });

  const filteredInvoices = invoices.filter(invoice => {
    const subscriber = subscribers.find(s => s.id === invoice.subscriberId);
    const matchesSearch = 
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subscriber && subscriber.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.taskTitle && invoice.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const totalCommission = invoices.reduce((sum, inv) => sum + (inv.commission || 0), 0);

  const paymentMethods = [
    { value: 'visa', label: 'فيزا', icon: <CreditCard size={16} /> },
    { value: 'transfer', label: 'تحويل', icon: <Banknote size={16} /> },
    { value: 'cash', label: 'كاش', icon: <Wallet size={16} /> },
    { value: 'custom', label: 'أخرى', icon: <FileText size={16} /> },
  ];

  const handleCreateInvoice = () => {
    if (newInvoice.subscriberId && newInvoice.amount && newInvoice.description && newInvoice.dueDate) {
      const invoiceData = {
        ...newInvoice,
        clientPaymentMethod: newInvoice.clientPaymentMethod === 'custom' 
          ? newInvoice.customClientPayment 
          : newInvoice.clientPaymentMethod,
        commissionReceivedMethod: newInvoice.commissionReceivedMethod === 'custom' 
          ? newInvoice.customCommissionReceived 
          : newInvoice.commissionReceivedMethod,
      };
      
      createInvoice(invoiceData);
      resetForm();
      setShowAddModal(false);
    }
  };

  const resetForm = () => {
    setNewInvoice({
      subscriberId: '',
      taskId: '',
      taskTitle: '',
      amount: 0,
      actualCost: 0,
      commission: 0,
      description: '',
      status: 'pending',
      dueDate: '',
      startDate: '',
      endDate: '',
      clientPaymentMethod: '',
      customClientPayment: '',
      commissionReceivedMethod: '',
      customCommissionReceived: '',
    });
  };

  const handleTaskSelection = (taskId: string) => {
    const selectedTask = tasks.find(t => t.id === taskId);
    if (selectedTask) {
      setNewInvoice({
        ...newInvoice,
        taskId: taskId,
        taskTitle: selectedTask.title,
        amount: selectedTask.expectedCost,
        actualCost: selectedTask.expectedCost,
        startDate: selectedTask.startDate.split('T')[0],
        endDate: selectedTask.endDate.split('T')[0],
      });
    }
  };

  const handleSendInvoiceToTechnician = (invoiceId: string) => {
    sendInvoiceToTechnician(invoiceId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="text-green-400\" size={16} />;
      case 'pending':
        return <Clock className="text-yellow-400\" size={16} />;
      case 'cancelled':
        return <XCircle className="text-red-400" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'مدفوعة';
      case 'pending':
        return 'معلقة';
      case 'cancelled':
        return 'ملغية';
      default:
        return 'غير محدد';
    }
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

  const handleExportInvoices = () => {
    exportInvoices();
  };

  const handlePrintInvoices = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة الفواتير</h2>
          <p className="text-gray-400">إنشاء ومتابعة فواتير الفنيين</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintInvoices}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
          >
            <Printer size={20} />
            طباعة
          </button>
          <button
            onClick={handleExportInvoices}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
          >
            <Download size={20} />
            تصدير الفواتير
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            <Plus size={20} />
            إنشاء فاتورة جديدة
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">إجمالي الفواتير</p>
              <p className="text-xl font-bold">{invoices.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <DollarSign className="text-emerald-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">إجمالي المبلغ</p>
              <p className="text-xl font-bold">{totalAmount.toLocaleString()} ريال</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">المبلغ المدفوع</p>
              <p className="text-xl font-bold">{paidAmount.toLocaleString()} ريال</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <DollarSign className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">إجمالي العمولات</p>
              <p className="text-xl font-bold">{totalCommission.toLocaleString()} ريال</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الفواتير..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'paid' | 'cancelled')}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">جميع الفواتير</option>
            <option value="pending">معلقة</option>
            <option value="paid">مدفوعة</option>
            <option value="cancelled">ملغية</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-right py-3 px-4 font-medium text-gray-300">رقم الفاتورة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">الفني</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">المهمة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">المبلغ</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">التكلفة الفعلية</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">العمولة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">طريقة دفع العميل</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">استلام العمولة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">الحالة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const subscriber = subscribers.find(s => s.id === invoice.subscriberId);
                return (
                  <tr key={invoice.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-indigo-400 font-mono">#{invoice.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      {subscriber ? (
                        <div>
                          <p className="font-medium text-white">
                            {subscriber.firstName} {subscriber.lastName}
                          </p>
                          <p className="text-sm text-gray-400">@{subscriber.username}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">فني غير موجود</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {invoice.taskTitle ? (
                        <div>
                          <p className="text-white font-medium">{invoice.taskTitle}</p>
                          {invoice.startDate && invoice.endDate && (
                            <p className="text-xs text-gray-400">
                              {format(new Date(invoice.startDate), 'dd/MM/yyyy')} - {format(new Date(invoice.endDate), 'dd/MM/yyyy')}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">غير محدد</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-emerald-400 font-medium">
                        {invoice.amount.toLocaleString()} ريال
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-blue-400">
                        {invoice.actualCost ? `${invoice.actualCost.toLocaleString()} ريال` : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-purple-400">
                        {invoice.commission ? `${invoice.commission.toLocaleString()} ريال` : '-'}
                      </span>
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
                      {invoice.commissionReceivedMethod ? (
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(invoice.commissionReceivedMethod)}
                          <span className="text-gray-300 text-sm">{invoice.commissionReceivedMethod}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(invoice.status)}
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleSendInvoiceToTechnician(invoice.id)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="إرسال الفاتورة للفني"
                        >
                          <Send size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-blue-400 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-green-400 transition-colors">
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">إنشاء فاتورة جديدة</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">الفني</label>
                <select
                  value={newInvoice.subscriberId}
                  onChange={(e) => setNewInvoice({ ...newInvoice, subscriberId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">اختر الفني</option>
                  {subscribers.map((subscriber) => (
                    <option key={subscriber.id} value={subscriber.id}>
                      {subscriber.firstName} {subscriber.lastName} (@{subscriber.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">اختيار المهمة</label>
                <select
                  value={newInvoice.taskId}
                  onChange={(e) => handleTaskSelection(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">اختر المهمة (اختياري)</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title} - {task.expectedCost} ريال
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">تاريخ البداية</label>
                <input
                  type="date"
                  value={newInvoice.startDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">تاريخ الانتهاء</label>
                <input
                  type="date"
                  value={newInvoice.endDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">المبلغ (ريال)</label>
                <input
                  type="number"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">التكلفة الفعلية (ريال)</label>
                <input
                  type="number"
                  value={newInvoice.actualCost}
                  onChange={(e) => setNewInvoice({ ...newInvoice, actualCost: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">العمولة الخاصة (ريال)</label>
                <input
                  type="number"
                  value={newInvoice.commission}
                  onChange={(e) => setNewInvoice({ ...newInvoice, commission: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">تاريخ الاستحقاق</label>
                <input
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">الوصف</label>
                <textarea
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                  placeholder="وصف الفاتورة"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* طريقة دفع العميل */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">طريقة دفع العميل</label>
                <select
                  value={newInvoice.clientPaymentMethod}
                  onChange={(e) => setNewInvoice({ ...newInvoice, clientPaymentMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">اختر طريقة الدفع</option>
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              {newInvoice.clientPaymentMethod === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">طريقة دفع أخرى</label>
                  <input
                    type="text"
                    value={newInvoice.customClientPayment}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customClientPayment: e.target.value })}
                    placeholder="اكتب طريقة الدفع"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* طريقة استلام العمولة */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">استلمنا العمولة عن طريق</label>
                <select
                  value={newInvoice.commissionReceivedMethod}
                  onChange={(e) => setNewInvoice({ ...newInvoice, commissionReceivedMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">اختر طريقة الاستلام</option>
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              {newInvoice.commissionReceivedMethod === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">طريقة استلام أخرى</label>
                  <input
                    type="text"
                    value={newInvoice.customCommissionReceived}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customCommissionReceived: e.target.value })}
                    placeholder="اكتب طريقة الاستلام"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateInvoice}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
              >
                إنشاء الفاتورة
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesManager;
