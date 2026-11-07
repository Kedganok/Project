'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TableTransfers } from '@/components/TableTransfers';
import { TransferItem } from '@/types/finance';
import { Clock, Receipt, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { month: 'พ.ค. 69', amount: 60000 },
  { month: 'มิ.ย. 69', amount: 350000 },
  { month: 'ก.ค. 69', amount: 170000 },
  { month: 'ส.ค. 69', amount: 340000 },
  { month: 'ก.ย. 69', amount: 200000 },
  { month: 'ต.ค. 69', amount: 435000 },
];

const initialTransfers: TransferItem[] = [
  { id: '1', date: '18/10/2026', refNo: 'TR-2026-0184', recipient: 'บริษัท สยามซัพพลาย จำกัด', channel: 'ธนาคารกสิกรไทย', amount: 103688, status: 'pending' },
  { id: '2', date: '14/10/2026', refNo: 'TR-2026-0182', recipient: 'หจก. รุ่งเรืองการช่าง', channel: 'เช็ค', amount: 84136, status: 'pending' },
  { id: '3', date: '11/10/2026', refNo: 'TR-2026-0181', recipient: 'บริษัท นอร์ทเทิร์นฟู้ดส์ จำกัด', channel: 'ธนาคารกรุงเทพ', amount: 245804, status: 'approved' },
  { id: '4', date: '24/09/2026', refNo: 'TR-2026-0179', recipient: 'นางสาวปิยะดา อินทรีย์', channel: 'ธนาคารออมสิน', amount: 45968, status: 'approved' },
  { id: '5', date: '09/09/2026', refNo: 'TR-2026-0176', recipient: 'บริษัท แอสเทิร์นพาร์ท จำกัด', channel: 'ธนาคารไทยพาณิชย์', amount: 163072, status: 'approved' },
];

export default function DashboardPage() {
  const [transfers, setTransfers] = useState<TransferItem[]>(initialTransfers);

  // ฟังก์ชันสลับสถานะ (สลับไป-มาระหว่าง รอตรวจสอบ <-> อนุมัติแล้ว)
  const handleToggleStatus = (id: string) => {
    setTransfers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === 'pending' ? 'approved' : 'pending',
          };
        }
        return item;
      })
    );
  };

  // คำนวณตัวเลขแบบ Dynamic ตามสถานะจริง
  const approvedTransfers = transfers.filter((t) => t.status === 'approved');
  const pendingTransfers = transfers.filter((t) => t.status === 'pending');
  const totalApprovedAmount = approvedTransfers.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">แดชบอร์ด</h2>
        <p className="text-xs text-gray-500 mt-1">ภาพรวมการโอนเงินและการตั้งเบิก</p>
      </div>

      {/* Dynamic Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative">
          <p className="text-xs text-gray-500 font-medium">ยอดสุทธิ (อนุมัติแล้ว)</p>
          <h3 className="text-xl font-bold text-gray-900 mt-2">
            ฿{totalApprovedAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-gray-400 mt-1">{approvedTransfers.length} รายการที่ยืนยันแล้ว</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative">
          <p className="text-xs text-gray-500 font-medium">รอตรวจสอบ</p>
          <h3 className="text-xl font-bold text-gray-900 mt-2">{pendingTransfers.length} รายการ</h3>
          <p className="text-[11px] text-gray-400 mt-1">ยังไม่ยืนยันการตั้งเบิก</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative">
          <p className="text-xs text-gray-500 font-medium">ภาษีหัก ณ ที่จ่ายรวม</p>
          <h3 className="text-xl font-bold text-gray-900 mt-2">฿46,441.50</h3>
          <p className="text-[11px] text-gray-400 mt-1">จากรายการทั้งหมดในระบบ</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative">
          <p className="text-xs text-gray-500 font-medium">รายการทั้งหมด</p>
          <h3 className="text-xl font-bold text-gray-900 mt-2">{transfers.length} รายการ</h3>
          <p className="text-[11px] text-gray-400 mt-1">นับรวมทุกสถานะ</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="mb-4">
          <h4 className="font-bold text-sm text-gray-900">ยอดโอนสุทธิรายเดือน</h4>
          <p className="text-xs text-gray-400">ย้อนหลัง 6 เดือน</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[0, 600000]} ticks={[0, 150000, 300000, 450000, 600000]} />
              <Bar dataKey="amount" fill="#1F2937" radius={[2, 2, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transfers Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b border-gray-100">
          <h4 className="font-bold text-sm text-gray-900">รายการล่าสุด</h4>
          <Link href="/transfers" className="text-xs text-gray-600 hover:text-black flex items-center gap-1 font-medium">
            ดูทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        {/* ส่ง props onToggleStatus เพื่อให้กดอนุมัติได้ */}
        <TableTransfers items={transfers} onToggleStatus={handleToggleStatus} />
      </div>
    </div>
  );
}