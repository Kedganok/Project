'use client';

import React, { useState } from 'react';
import { TableTransfers } from '@/components/TableTransfers';
import { TransferItem } from '@/types/finance';
import { Search, Plus, X } from 'lucide-react';

const initialTransfers: TransferItem[] = [
  { id: '1', date: '18/10/2026', refNo: 'TR-2026-0184', recipient: 'บริษัท สยามซัพพลาย จำกัด', channel: 'ธนาคารกสิกรไทย', amount: 103688, status: 'pending' },
  { id: '2', date: '14/10/2026', refNo: 'TR-2026-0182', recipient: 'หจก. รุ่งเรืองการช่าง', channel: 'เช็ค', amount: 84136, status: 'pending' },
  { id: '3', date: '11/10/2026', refNo: 'TR-2026-0181', recipient: 'บริษัท นอร์ทเทิร์นฟู้ดส์ จำกัด', channel: 'ธนาคารกรุงเทพ', amount: 245804, status: 'approved' },
  { id: '4', date: '24/09/2026', refNo: 'TR-2026-0179', recipient: 'นางสาวปิยะดา อินทรีย์', channel: 'ธนาคารออมสิน', amount: 45968, status: 'approved' },
  { id: '5', date: '09/09/2026', refNo: 'TR-2026-0176', recipient: 'บริษัท แอสเทิร์นพาร์ท จำกัด', channel: 'ธนาคารไทยพาณิชย์', amount: 163072, status: 'approved' },
];

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<TransferItem[]>(initialTransfers);
  const [transferFilter, setTransferFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State สำหรับเปิด/ปิด Modal และเก็บข้อมูลฟอร์ม
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ recipient: '', channel: 'ธนาคารกสิกรไทย', amount: '' });

  // ฟังก์ชันสลับสถานะ อนุมัติแล้ว <-> รอตรวจสอบ
  const handleToggleStatus = (id: string) => {
    setTransfers(
      transfers.map((item) =>
        item.id === id ? { ...item, status: item.status === 'pending' ? 'approved' : 'pending' } : item
      )
    );
  };

  // ฟังก์ชันเพิ่มรายการโอนใหม่
  const handleAddTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipient || !formData.amount) return;

    const newItem: TransferItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('th-TH'),
      refNo: `TR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      recipient: formData.recipient,
      channel: formData.channel,
      amount: parseFloat(formData.amount),
      status: 'pending',
    };

    setTransfers([newItem, ...transfers]);
    setFormData({ recipient: '', channel: 'ธนาคารกสิกรไทย', amount: '' });
    setIsModalOpen(false);
  };

  const pendingCount = transfers.filter((t) => t.status === 'pending').length;
  const approvedCount = transfers.filter((t) => t.status === 'approved').length;

  const filteredTransfers = transfers.filter((t) => {
    const matchesSearch =
      t.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.refNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = transferFilter === 'all' ? true : t.status === transferFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header และ ปุ่มเพิ่มรายการ */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">รายการโอน</h2>
          <p className="text-xs text-gray-500 mt-1">ค้นหา ตรวจสอบ และบันทึกรายการโอนเงินทุกรายการ</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-800 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> เพิ่มรายการโอน
        </button>
      </div>

      {/* ช่องค้นหา และ ฟิลเตอร์ */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาผู้รับโอน / เลขอ้างอิง"
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setTransferFilter('all')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                transferFilter === 'all' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              ทั้งหมด ({transfers.length})
            </button>
            <button
              onClick={() => setTransferFilter('pending')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                transferFilter === 'pending' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              รอตรวจสอบ ({pendingCount})
            </button>
            <button
              onClick={() => setTransferFilter('approved')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                transferFilter === 'approved' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              อนุมัติแล้ว ({approvedCount})
            </button>
          </div>
        </div>
        
        {/* ตารางแสดงรายการโอน */}
        <TableTransfers items={filteredTransfers} onToggleStatus={handleToggleStatus} />
      </div>

      {/* Modal ป๊อปอัพสำหรับเพิ่มรายการโอน */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-gray-900">เพิ่มรายการโอนเงินใหม่</h3>
              <button onClick={() => setIsModalOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAddTransfer} className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">ชื่อผู้รับโอน / บริษัท</label>
                <input
                  required
                  type="text"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-black outline-none"
                  placeholder="เช่น บริษัท เออบาน่า จำกัด"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">ช่องทางชำระเงิน</label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-black outline-none"
                >
                  <option value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย</option>
                  <option value="ธนาคารกรุงเทพ">ธนาคารกรุงเทพ</option>
                  <option value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์</option>
                  <option value="เช็ค">เช็ค</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">จำนวนเงิน (บาท)</label>
                <input
                  required
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-black outline-none"
                  placeholder="50000"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium cursor-pointer hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-gray-800"
                >
                  บันทึกรายการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
