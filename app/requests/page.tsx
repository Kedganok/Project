'use client';

import React, { useState } from 'react';
import { PaymentRequestItem } from '@/types/finance';
import { Search, Plus, X } from 'lucide-react';

const initialRequests: PaymentRequestItem[] = [
  { id: '1', empId: 'P1001', empName: 'นางสาวสมพร สมบูรณ์', amount: 28500, status: 'paid', dueDate: 'จ่ายเมื่อ 27/10/2026' },
  { id: '2', empId: 'P1002', empName: 'นางสาวอาริยา สุขเจริญ', amount: 34200, status: 'paid', dueDate: 'จ่ายเมื่อ 27/10/2026' },
  { id: '3', empId: 'P1003', empName: 'นายอรรถพล มั่นคง', amount: 41900, status: 'paid', dueDate: 'จ่ายเมื่อ 27/10/2026' },
  { id: '4', empId: 'P1004', empName: 'นางสาวศิริพร บุญมี', amount: 26750, status: 'paid', dueDate: 'จ่ายเมื่อ 27/10/2026' },
  { id: '5', empId: 'P1005', empName: 'นายภูมิพัฒน์ รัตนบำรุง', amount: 52400, status: 'paid', dueDate: 'จ่ายเมื่อ 30/09/2026' },
  { id: '6', empId: 'P1006', empName: 'นางสาวอุทุมพร ใจดี', amount: 31000, status: 'paid', dueDate: 'จ่ายเมื่อ 30/09/2026' },
];

export default function RequestsPage() {
  const [requests, setRequests] = useState<PaymentRequestItem[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State ควบคุม Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ empId: '', empName: '', amount: '' });

  // ฟังก์ชันเพิ่มคำขอจ่ายเงินใหม่
  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.empId || !formData.empName || !formData.amount) return;

    const newItem: PaymentRequestItem = {
      id: Date.now().toString(),
      empId: formData.empId,
      empName: formData.empName,
      amount: parseFloat(formData.amount),
      status: 'paid',
      dueDate: `จ่ายเมื่อ ${new Date().toLocaleDateString('th-TH')}`,
    };

    setRequests([newItem, ...requests]);
    setFormData({ empId: '', empName: '', amount: '' });
    setIsModalOpen(false);
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.empId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">รายการคำขอจ่ายเงินสำหรับพนักงาน</h2>
          <p className="text-xs text-gray-500 mt-1">ขอบริหารจัดการการเบิกจ่ายสวัสดิการและเบี้ยเลี้ยงพนักงาน</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-800 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> เพิ่มคำขอจ่ายเงิน
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Modal ป๊อปอัพเพิ่มคำขอจ่ายเงิน */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-gray-900">เพิ่มคำขอจ่ายเงินพนักงาน</h3>
              <button onClick={() => setIsModalOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAddRequest} className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">รหัสพนักงาน</label>
                <input
                  required
                  type="text"
                  value={formData.empId}
                  onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-black outline-none"
                  placeholder="P1008"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">ชื่อ-นามสกุล พนักงาน</label>
                <input
                  required
                  type="text"
                  value={formData.empName}
                  onChange={(e) => setFormData({ ...formData, empName: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-black outline-none"
                  placeholder="นายสมชาย ใจกล้า"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">จำนวนเงินเบิกจ่าย (บาท)</label>
                <input
                  required
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-black outline-none"
                  placeholder="25000"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-medium cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  บันทึกคำขอ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}