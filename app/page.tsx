'use client';

import React, { useState } from 'react';
import { Coins, Clock, Receipt, Search, Plus, ArrowRight, X, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// --- TYPES ---
type NavTab = 'dashboard' | 'transfers' | 'requests' | 'pay-cycles' | 'reports';

interface TransferItem {
  id: string;
  date: string;
  refNo: string;
  recipient: string;
  channel: string;
  amount: number;
  status: 'pending' | 'approved';
}

interface PaymentRequestItem {
  id: string;
  empId: string;
  empName: string;
  amount: number;
  status: 'paid';
  dueDate: string;
}

interface ChannelReportItem {
  channel: string;
  count: number;
  preTaxAmount: number;
  whtAmount: number;
  vatAmount: number;
  netAmount: number;
}

// --- MOCK DATA ---
const initialTransfers: TransferItem[] = [
  { id: '1', date: '18/10/2026', refNo: 'TR-2026-0184', recipient: 'บริษัท สยามซัพพลาย จำกัด', channel: 'ธนาคารกสิกรไทย', amount: 103688, status: 'pending' },
  { id: '2', date: '14/10/2026', refNo: 'TR-2026-0182', recipient: 'หจก. รุ่งเรืองการช่าง', channel: 'เช็ค', amount: 84136, status: 'pending' },
  { id: '3', date: '11/10/2026', refNo: 'TR-2026-0181', recipient: 'บริษัท นอร์ทเทิร์นฟู้ดส์ จำกัด', channel: 'ธนาคารกรุงเทพ', amount: 245804, status: 'approved' },
  { id: '4', date: '24/09/2026', refNo: 'TR-2026-0179', recipient: 'นางสาวปิยะดา อินทรีย์', channel: 'ธนาคารออมสิน', amount: 45968, status: 'approved' },
  { id: '5', date: '09/09/2026', refNo: 'TR-2026-0176', recipient: 'บริษัท แอสเทิร์นพาร์ท จำกัด', channel: 'ธนาคารไทยพาณิชย์', amount: 163072, status: 'approved' },
  { id: '6', date: '01/09/2026', refNo: 'TR-2026-0175', recipient: 'บริษัท เพาเวอร์เทค จำกัด', channel: 'ธนาคารกสิกรไทย', amount: 92400, status: 'approved' },
  { id: '7', date: '25/08/2026', refNo: 'TR-2026-0170', recipient: 'หจก. สมาร์ทโซลูชันส์', channel: 'ธนาคารกรุงเทพ', amount: 135000, status: 'approved' },
];

const initialRequests: PaymentRequestItem[] = [
  { id: '1', empId: 'P1001', empName: 'นางสาวสมพร สมบูรณ์', amount: 28500, status: 'paid', dueDate: 'จ่ายเมื่อ 27/10/2026' },
  { id: '2', empId: 'P1002', empName: 'นางสาวอาริยา สุขเจริญ', amount: 34200, status: 'paid', dueDate: 'จ่ายเมื่อ 27/10/2026' },
  { id: '3', empId: 'P1003', empName: 'นายอรรถพล มั่นคง', amount: 41900, status: 'paid', dueDate: 'จ่ายเมื่อ 27/10/2026' },
  { id: '4', empId: 'P1004', empName: 'นางสาวศิริพร บุญมี', amount: 26750, status: 'paid', dueDate: 'จ่ายเมื่อ 27/10/2026' },
  { id: '5', empId: 'P1005', empName: 'นายภูมิพัฒน์ รัตนบำรุง', amount: 52400, status: 'paid', dueDate: 'จ่ายเมื่อ 30/09/2026' },
  { id: '6', empId: 'P1006', empName: 'นางสาวอุทุมพร ใจดี', amount: 31000, status: 'paid', dueDate: 'จ่ายเมื่อ 30/09/2026' },
  { id: '7', empId: 'P1007', empName: 'นายเกริกเกียรติ พรหมเสน', amount: 38500, status: 'paid', dueDate: 'จ่ายเมื่อ 30/09/2026' },
];

const chartData = [
  { month: 'พ.ค. 69', amount: 60000 },
  { month: 'มิ.ย. 69', amount: 350000 },
  { month: 'ก.ค. 69', amount: 170000 },
  { month: 'ส.ค. 69', amount: 340000 },
  { month: 'ก.ย. 69', amount: 200000 },
  { month: 'ต.ค. 69', amount: 435000 },
];

const mockReports: ChannelReportItem[] = [
  { channel: 'ธนาคารกรุงเทพ', count: 4, preTaxAmount: 926350, whtAmount: 23440.5, vatAmount: 54694.5, netAmount: 947604 },
  { channel: 'ธนาคารกสิกรไทย', count: 4, preTaxAmount: 362100, whtAmount: 8091.0, vatAmount: 18879.0, netAmount: 372888 },
  { channel: 'เช็ค', count: 3, preTaxAmount: 204900, whtAmount: 6697.0, vatAmount: 14343.0, netAmount: 212546 },
];

// --- MAIN PAGE COMPONENT ---
export default function Page() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [transfers, setTransfers] = useState<TransferItem[]>(initialTransfers);
  const [requests, setRequests] = useState<PaymentRequestItem[]>(initialRequests);

  const [transferSearch, setTransferSearch] = useState('');
  const [transferFilter, setTransferFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [requestSearch, setRequestSearch] = useState('');
  const [reportFilter, setReportFilter] = useState<'all' | 'approved'>('all');

  const [cutoffDay, setCutoffDay] = useState('25');
  const [payDay, setPayDay] = useState('30');

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const [newTransfer, setNewTransfer] = useState({ recipient: '', channel: 'ธนาคารกสิกรไทย', amount: '' });
  const [newRequest, setNewRequest] = useState({ empId: '', empName: '', amount: '' });

  const approvedTransfers = transfers.filter((t) => t.status === 'approved');
  const pendingTransfers = transfers.filter((t) => t.status === 'pending');
  const totalApprovedAmount = approvedTransfers.reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransfer.recipient || !newTransfer.amount) return;

    const newItem: TransferItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('th-TH'),
      refNo: `TR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      recipient: newTransfer.recipient,
      channel: newTransfer.channel,
      amount: parseFloat(newTransfer.amount),
      status: 'pending',
    };

    setTransfers([newItem, ...transfers]);
    setNewTransfer({ recipient: '', channel: 'ธนาคารกสิกรไทย', amount: '' });
    setIsTransferModalOpen(false);
  };

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.empId || !newRequest.empName || !newRequest.amount) return;

    const newItem: PaymentRequestItem = {
      id: Date.now().toString(),
      empId: newRequest.empId,
      empName: newRequest.empName,
      amount: parseFloat(newRequest.amount),
      status: 'paid',
      dueDate: `จ่ายเมื่อ ${new Date().toLocaleDateString('th-TH')}`,
    };

    setRequests([newItem, ...requests]);
    setNewRequest({ empId: '', empName: '', amount: '' });
    setIsRequestModalOpen(false);
  };

  // ฟังก์ชันสลับสถานะ (สลับไป-มาระหว่าง รอตรวจสอบ <-> อนุมัติแล้ว)
  const handleToggleStatus = (id: string) => {
    setTransfers(
      transfers.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'pending' ? 'approved' : 'pending';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const filteredTransfers = transfers.filter((t) => {
    const matchesSearch = t.recipient.toLowerCase().includes(transferSearch.toLowerCase()) || t.refNo.toLowerCase().includes(transferSearch.toLowerCase());
    const matchesStatus = transferFilter === 'all' ? true : t.status === transferFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRequests = requests.filter((r) => 
    r.empName.toLowerCase().includes(requestSearch.toLowerCase()) || r.empId.toLowerCase().includes(requestSearch.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* Sidebar Component */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* PAGE 1: แดชบอร์ด */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">แดชบอร์ด</h2>
              <p className="text-xs text-gray-500 mt-1">ภาพรวมการโอนเงินและการตั้งเบิก</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative">
                <p className="text-xs text-gray-500 font-medium">ยอดสุทธิ (อนุมัติแล้ว)</p>
                <h3 className="text-xl font-bold text-gray-900 mt-2">฿{totalApprovedAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</h3>
                <p className="text-[11px] text-gray-400 mt-1">{approvedTransfers.length} รายการที่ยืนยันแล้ว</p>
                <div className="absolute top-5 right-5 w-7 h-7 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-xs text-gray-400">฿</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative cursor-pointer hover:border-gray-300 transition" onClick={() => { setActiveTab('transfers'); setTransferFilter('pending'); }}>
                <p className="text-xs text-gray-500 font-medium">รอตรวจสอบ</p>
                <h3 className="text-xl font-bold text-gray-900 mt-2">{pendingTransfers.length} รายการ</h3>
                <p className="text-[11px] text-gray-400 mt-1">ยังไม่ยืนยันการตั้งเบิก</p>
                <Clock className="absolute top-5 right-5 w-4 h-4 text-gray-400" />
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative">
                <p className="text-xs text-gray-500 font-medium">ภาษีหัก ณ ที่จ่ายรวม</p>
                <h3 className="text-xl font-bold text-gray-900 mt-2">฿46,441.50</h3>
                <p className="text-[11px] text-gray-400 mt-1">จากรายการทั้งหมดในระบบ</p>
                <Receipt className="absolute top-5 right-5 w-4 h-4 text-gray-400" />
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative cursor-pointer hover:border-gray-300 transition" onClick={() => { setActiveTab('transfers'); setTransferFilter('all'); }}>
                <p className="text-xs text-gray-500 font-medium">รายการทั้งหมด</p>
                <h3 className="text-xl font-bold text-gray-900 mt-2">{transfers.length} รายการ</h3>
                <p className="text-[11px] text-gray-400 mt-1">นับรวมทุกสถานะ</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="mb-4">
                <h4 className="font-bold text-sm text-gray-900">ยอดโอนสุทธิรายเดือน</h4>
                <p className="text-xs text-gray-400">ย้อนหลัง 6 เดือน</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tick={{ fontSize: 11, fill: '#6B7280' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[0, 600000]} ticks={[0, 150000, 300000, 450000, 600000]} />
                    <Bar dataKey="amount" fill="#1F2937" radius={[2, 2, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 flex justify-between items-center border-b border-gray-100">
                <h4 className="font-bold text-sm text-gray-900">รายการล่าสุด</h4>
                <button onClick={() => setActiveTab('transfers')} className="text-xs text-gray-600 hover:text-black flex items-center gap-1 font-medium">
                  ดูทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <TableTransfers items={transfers.slice(0, 5)} onToggleStatus={handleToggleStatus} />
            </div>
          </div>
        )}

        {/* PAGE 2: รายการโอนเงิน */}
        {activeTab === 'transfers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">รายการโอน</h2>
                <p className="text-xs text-gray-500 mt-1">ค้นหา ตรวจสอบ และบันทึกรายการโอนเงินทุกรายการ</p>
              </div>
              <button onClick={() => setIsTransferModalOpen(true)} className="bg-black text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-800 transition">
                <Plus className="w-4 h-4" /> เพิ่มรายการโอน
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
              <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={transferSearch}
                    onChange={(e) => setTransferSearch(e.target.value)}
                    placeholder="ค้นหาผู้รับโอน / เลขอ้างอิง"
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium">
                  <button onClick={() => setTransferFilter('all')} className={`px-3 py-1.5 rounded-md transition ${transferFilter === 'all' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}>
                    ทั้งหมด ({transfers.length})
                  </button>
                  <button onClick={() => setTransferFilter('pending')} className={`px-3 py-1.5 rounded-md transition ${transferFilter === 'pending' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}>
                    รอตรวจสอบ ({pendingTransfers.length})
                  </button>
                  <button onClick={() => setTransferFilter('approved')} className={`px-3 py-1.5 rounded-md transition ${transferFilter === 'approved' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}>
                    อนุมัติแล้ว ({approvedTransfers.length})
                  </button>
                </div>
              </div>
              <TableTransfers items={filteredTransfers} onToggleStatus={handleToggleStatus} />
            </div>
          </div>
        )}

        {/* PAGE 3: คำขอจ่ายเงิน */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">รายการคำขอจ่ายเงินสำหรับพนักงาน</h2>
                <p className="text-xs text-gray-500 mt-1">ขอบริหารจัดการการเบิกจ่ายสวัสดิการและเบี้ยเลี้ยงพนักงาน</p>
              </div>
              <button onClick={() => setIsRequestModalOpen(true)} className="bg-black text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-800 transition">
                <Plus className="w-4 h-4" /> เพิ่มคำขอจ่ายเงิน
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    placeholder="ค้นหารหัสรหัส / ชื่อพนักงาน"
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-medium">
                    <th className="py-3 px-4">รหัสพนักงาน</th>
                    <th className="py-3 px-4">ชื่อพนักงาน</th>
                    <th className="py-3 px-4">จำนวนเงิน</th>
                    <th className="py-3 px-4">สถานะ</th>
                    <th className="py-3 px-4 text-right">กำหนดจ่าย</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-semibold text-gray-900">{req.empId}</td>
                      <td className="py-3 px-4 text-gray-700">{req.empName}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">฿{req.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-medium border border-emerald-400 text-emerald-600 bg-emerald-50/50">
                          จ่ายแล้ว
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-400">{req.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAGE 4: รอบการจ่ายเงิน */}
        {activeTab === 'pay-cycles' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">กำหนดรอบตัดรอบและวันจ่ายเงิน</h2>
              <p className="text-xs text-gray-500 mt-1">ตั้งค่ารอบเวลาตัดรอบและวันจ่ายเงิน</p>
            </div>

            <div className="space-y-4 max-w-4xl">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">การตั้งค่าวันตัดรอบ</h4>
                  <p className="text-xs text-gray-400">Cut-off Settings</p>
                </div>
                <div className="pt-2">
                  <label className="block text-xs text-gray-600 mb-1">วันตัดรอบ (Cut-off Day)</label>
                  <select value={cutoffDay} onChange={(e) => setCutoffDay(e.target.value)} className="w-full max-w-xs bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-black">
                    <option value="20">วันที่ 20</option>
                    <option value="25">วันที่ 25</option>
                    <option value="28">วันที่ 28</option>
                  </select>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">การตั้งค่าวันจ่ายเงิน</h4>
                  <p className="text-xs text-gray-400">Pay Day Settings</p>
                </div>
                <div className="pt-2">
                  <label className="block text-xs text-gray-600 mb-1">วันจ่ายเงิน (Pay Day)</label>
                  <select value={payDay} onChange={(e) => setPayDay(e.target.value)} className="w-full max-w-xs bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-black">
                    <option value="28">วันที่ 28</option>
                    <option value="30">วันที่ 30</option>
                    <option value="31">สิ้นเดือน</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => alert('บันทึกการตั้งค่าเรียบร้อยแล้ว!')} className="bg-black text-white px-5 py-2.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition">
                  บันทึกการตั้งค่า
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 5: รายงาน */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">รายงาน</h2>
                <p className="text-xs text-gray-500 mt-1">สรุปยอดโอนเงิน และยอดสุทธิที่ต้องจ่าย</p>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium">
                <button onClick={() => setReportFilter('all')} className={`px-3 py-1.5 rounded-md transition ${reportFilter === 'all' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}>
                  ทุกรายการ
                </button>
                <button onClick={() => setReportFilter('approved')} className={`px-3 py-1.5 rounded-md transition ${reportFilter === 'approved' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}>
                  อนุมัติแล้วเท่านั้น
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">ยอดสุทธิรวม</p>
                <h3 className="text-xl font-bold text-gray-900 mt-2">฿1,565,870.00</h3>
                <p className="text-[11px] text-gray-400 mt-1">13 รายการ</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">ยอดก่อนหักภาษีรวม</p>
                <h3 className="text-xl font-bold text-gray-900 mt-2">฿1,508,050.00</h3>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">ภาษีหัก ณ ที่จ่ายรวม</p>
                <h3 className="text-xl font-bold text-gray-900 mt-2">฿46,441.50</h3>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">ภาษีมูลค่าเพิ่มรวม</p>
                <h3 className="text-xl font-bold text-gray-900 mt-2">฿104,261.50</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="mb-4">
                <h4 className="font-bold text-sm text-gray-900">ยอดโอนสุทธิรายเดือน</h4>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tick={{ fontSize: 11, fill: '#6B7280' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[0, 450000]} ticks={[0, 50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000]} />
                    <Bar dataKey="amount" fill="#1F2937" radius={[2, 2, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
              <div>
                <h4 className="font-bold text-sm text-gray-900">สรุปตามช่องทาง</h4>
                <p className="text-xs text-gray-400">เรียงตามยอดรวมรายการโอนเงิน</p>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-medium">
                    <th className="py-3 px-2">ช่องทาง</th>
                    <th className="py-3 px-2 text-center">จำนวน</th>
                    <th className="py-3 px-2 text-right">ยอดก่อนภาษี</th>
                    <th className="py-3 px-2 text-right">ภาษีหัก ณ ที่จ่าย</th>
                    <th className="py-3 px-2 text-right">VAT</th>
                    <th className="py-3 px-2 text-right">ยอดสุทธิ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockReports.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 px-2 font-semibold text-gray-900">{row.channel}</td>
                      <td className="py-3 px-2 text-center text-gray-700">{row.count}</td>
                      <td className="py-3 px-2 text-right text-gray-700">฿{row.preTaxAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-2 text-right text-gray-700">฿{row.whtAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-2 text-right text-gray-700">฿{row.vatAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-2 text-right font-bold text-gray-900">฿{row.netAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: เพิ่มรายการโอนเงิน */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-gray-900">เพิ่มรายการโอนเงินใหม่</h3>
              <button onClick={() => setIsTransferModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddTransfer} className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">ชื่อผู้รับโอน / บริษัท</label>
                <input required type="text" value={newTransfer.recipient} onChange={(e) => setNewTransfer({ ...newTransfer, recipient: e.target.value })} className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-black outline-none" placeholder="เช่น บริษัท เออบาน่า จำกัด" />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">ช่องทางชำระเงิน</label>
                <select value={newTransfer.channel} onChange={(e) => setNewTransfer({ ...newTransfer, channel: e.target.value })} className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-black outline-none">
                  <option value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย</option>
                  <option value="ธนาคารกรุงเทพ">ธนาคารกรุงเทพ</option>
                  <option value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์</option>
                  <option value="เช็ค">เช็ค</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">จำนวนเงิน (บาท)</label>
                <input required type="number" value={newTransfer.amount} onChange={(e) => setNewTransfer({ ...newTransfer, amount: e.target.value })} className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-black outline-none" placeholder="50000" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsTransferModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-medium">ยกเลิก</button>
                <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg text-xs font-medium">บันทึกรายการ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: เพิ่มคำขอจ่ายเงิน */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-gray-900">เพิ่มคำขอจ่ายเงินพนักงาน</h3>
              <button onClick={() => setIsRequestModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddRequest} className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">รหัสพนักงาน</label>
                <input required type="text" value={newRequest.empId} onChange={(e) => setNewRequest({ ...newRequest, empId: e.target.value })} className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-black outline-none" placeholder="P1008" />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">ชื่อ-นามสกุล พนักงาน</label>
                <input required type="text" value={newRequest.empName} onChange={(e) => setNewRequest({ ...newRequest, empName: e.target.value })} className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-black outline-none" placeholder="นายสมชาย ใจกล้า" />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">จำนวนเงินเบิกจ่าย (บาท)</label>
                <input required type="number" value={newRequest.amount} onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })} className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-black outline-none" placeholder="25000" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsRequestModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-medium">ยกเลิก</button>
                <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg text-xs font-medium">บันทึกคำขอ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB COMPONENTS ---

function Sidebar({ activeTab, setActiveTab }: { activeTab: NavTab; setActiveTab: (tab: NavTab) => void }) {
  const menuItems: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'แดชบอร์ด' },
    { id: 'transfers', label: 'รายการโอนเงิน' },
    { id: 'requests', label: 'คำขอจ่ายเงิน' },
    { id: 'pay-cycles', label: 'รอบการจ่ายเงิน' },
    { id: 'reports', label: 'รายงาน' },
  ];

  return (
    <aside className="w-72 bg-[#061A14] text-white min-h-screen flex flex-col justify-between p-6 select-none shrink-0">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#D4A359] text-black font-semibold rounded-lg flex items-center justify-center text-lg">
            AF
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">บัญชีและการเงิน</h1>
            <p className="text-xs text-gray-400 font-light tracking-wide">Accounting and Finance</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative ${
                  isActive
                    ? 'bg-[#122A22] text-white font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-[#0C221B]'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#D4A359] rounded-r-md" />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-[#122A22] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4A359] rounded-lg flex items-center justify-center text-black font-semibold">
            <span>AF</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white leading-tight">Mr. PATIPAT SRANGTAN</p>
            <p className="text-xs text-gray-400">HR</p>
          </div>
        </div>
        <button onClick={() => alert('ออกจากระบบ')} className="text-gray-400 hover:text-white p-1">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}

function TableTransfers({ items, onToggleStatus }: { items: TransferItem[]; onToggleStatus: (id: string) => void }) {
  return (
    <table className="w-full text-left border-collapse text-xs">
      <thead>
        <tr className="border-b border-gray-100 text-gray-400 font-medium">
          <th className="py-3 px-4">วันที่</th>
          <th className="py-3 px-4">หมายเลขอ้างอิง</th>
          <th className="py-3 px-4">ผู้รับโอน</th>
          <th className="py-3 px-4">ช่องทาง</th>
          <th className="py-3 px-4 text-right">ยอดสุทธิ</th>
          <th className="py-3 px-4 text-center">สถานะ / การจัดการ</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {items.length === 0 ? (
          <tr>
            <td colSpan={6} className="py-8 text-center text-gray-400">ไม่พบรายการโอนเงิน</td>
          </tr>
        ) : (
          items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/50">
              <td className="py-3 px-4 text-gray-500">{item.date}</td>
              <td className="py-3 px-4 font-bold text-gray-900">{item.refNo}</td>
              <td className="py-3 px-4 text-gray-700">{item.recipient}</td>
              <td className="py-3 px-4 text-gray-500">{item.channel}</td>
              <td className="py-3 px-4 text-right font-bold text-gray-900">
                ฿{item.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </td>
              <td className="py-3 px-4 text-center">
                {item.status === 'pending' ? (
                  <button
                    onClick={() => onToggleStatus(item.id)}
                    title="กดเพื่อยืนยันอนุมัติ"
                    className="px-3 py-1 rounded-md text-[11px] border border-gray-300 text-gray-600 bg-white hover:bg-black hover:text-white transition flex items-center gap-1 mx-auto cursor-pointer"
                  >
                    รอตรวจสอบ
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleStatus(item.id)}
                    title="กดเพื่อยกเลิกการอนุมัติ"
                    className="px-3 py-1 rounded-md text-[11px] font-medium bg-black text-white hover:bg-red-600 transition flex items-center gap-1 mx-auto cursor-pointer"
                  >
                    อนุมัติแล้ว
                  </button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}