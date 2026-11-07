'use client';

import React, { useState } from 'react';
import { ChannelReportItem } from '@/types/finance';
import { Download, Upload } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { month: 'พ.ค. 69', amount: 60000 },
  { month: 'มิ.ย. 69', amount: 350000 },
  { month: 'ก.ค. 69', amount: 170000 },
  { month: 'ส.ค. 69', amount: 340000 },
  { month: 'ก.ย. 69', amount: 200000 },
  { month: 'ต.ค. 69', amount: 435000 },
];

const initialReports: ChannelReportItem[] = [
  { channel: 'ธนาคารกรุงเทพ', count: 3, preTaxAmount: 791350, whtAmount: 23440.5, vatAmount: 54694.5, netAmount: 812604 },
  { channel: 'ธนาคารกสิกรไทย', count: 3, preTaxAmount: 269700, whtAmount: 8091, vatAmount: 18879, netAmount: 280488 },
  { channel: 'เช็ค', count: 3, preTaxAmount: 204900, whtAmount: 6697, vatAmount: 14343, netAmount: 212546 },
];

export default function ReportsPage() {
  const [reportFilter, setReportFilter] = useState<'all' | 'approved'>('all');
  const [reportsData, setReportsData] = useState<ChannelReportItem[]>(initialReports);

  // 1. ฟังก์ชันดาวน์โหลด/ส่งออกข้อมูลเป็นไฟล์ CSV (Export Feature)
  const handleExportCSV = () => {
    // กำหนด Header ของ CSV
    const headers = ['ช่องทาง', 'จำนวนรายการ', 'ยอดก่อนภาษี', 'ภาษีหัก ณ ที่จ่าย', 'VAT', 'ยอดสุทธิ'];
    
    // แปลงข้อมูลในตารางเป็น Row
    const rows = reportsData.map((item) => [
      `"${item.channel}"`,
      item.count,
      item.preTaxAmount,
      item.whtAmount,
      item.vatAmount,
      item.netAmount,
    ]);

    // รวม Header และ Rows เป็นเนื้อหา CSV
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    // ใส่ BOM (\uFEFF) เพื่อให้ Excel อ่านภาษาไทยได้ถูกต้อง ไม่เป็นต่างดาว
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', `รายงานสรุปตามช่องทาง_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. ฟังก์ชันนำเข้าไฟล์ CSV (Import Feature)
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length <= 1) return; // ถ้ามีแค่ header หรือไม่มีข้อมูล

      const parsedItems: ChannelReportItem[] = [];

      // อ่านบรรทัดข้อมูล (ข้าม header บรรทัดแรก)
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(col => col.replace(/^"(.*)"$/, '$1').trim());
        if (cols.length >= 6) {
          parsedItems.push({
            channel: cols[0],
            count: Number(cols[1]) || 0,
            preTaxAmount: Number(cols[2]) || 0,
            whtAmount: Number(cols[3]) || 0,
            vatAmount: Number(cols[4]) || 0,
            netAmount: Number(cols[5]) || 0,
          });
        }
      }

      if (parsedItems.length > 0) {
        setReportsData(parsedItems);
        alert(`นำเข้าข้อมูลจากไฟล์ "${file.name}" สำเร็จเรียบร้อยแล้ว (${parsedItems.length} รายการ)`);
      } else {
        alert('รูปแบบไฟล์ CSV ไม่ถูกต้อง');
      }
    };

    reader.readAsText(file, 'UTF-8');
    e.target.value = ''; // Reset input
  };

  return (
    <div className="space-y-6">
      {/* Header & Control Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">รายงาน</h2>
          <p className="text-xs text-gray-500 mt-1">สรุปยอดโอนเงิน และยอดสุทธิที่ต้องจ่าย</p>
        </div>

        <div className="flex items-center gap-3">
          {/* ปุ่มนำเข้าข้อมูล (Import CSV) */}
          <label className="bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-50 cursor-pointer transition shadow-sm">
            <Upload className="w-4 h-4 text-gray-500" />
            <span>นำเข้าข้อมูล (CSV)</span>
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>

          {/* ปุ่มส่งออกรายงาน (Export CSV) */}
          <button
            onClick={handleExportCSV}
            className="bg-black text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-800 transition shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออกรายงาน (CSV)</span>
          </button>
        </div>
      </div>

      {/* Report Metric Cards */}
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

      {/* Monthly Bar Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="mb-4">
          <h4 className="font-bold text-sm text-gray-900">ยอดโอนสุทธิรายเดือน</h4>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[0, 450000]} ticks={[0, 50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000]} />
              <Bar dataKey="amount" fill="#1F2937" radius={[2, 2, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary by Channel Table */}
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
            {reportsData.map((row, idx) => (
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
  );
}