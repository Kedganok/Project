'use client';

import React, { useState } from 'react';

export default function PayCyclesPage() {
  const [cutoffDay, setCutoffDay] = useState('25');
  const [payDay, setPayDay] = useState('30');

  const handleSave = () => {
    alert(`บันทึกการตั้งค่าเรียบร้อยแล้ว!\n- วันตัดรอบ: วันที่ ${cutoffDay}\n- วันจ่ายเงิน: วันที่ ${payDay}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">กำหนดรอบตัดรอบและวันจ่ายเงิน</h2>
        <p className="text-xs text-gray-500 mt-1">ตั้งค่ารอบเวลาตัดรอบและวันจ่ายเงิน</p>
      </div>

      <div className="space-y-4 max-w-4xl">
        {/* การตั้งค่าวันตัดรอบ */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <div>
            <h4 className="font-bold text-sm text-gray-900">การตั้งค่าวันตัดรอบ</h4>
            <p className="text-xs text-gray-400">Cut-off Settings</p>
          </div>
          <div className="pt-2">
            <label className="block text-xs text-gray-600 mb-1">วันตัดรอบ (Cut-off Day)</label>
            <select
              value={cutoffDay}
              onChange={(e) => setCutoffDay(e.target.value)}
              className="w-full max-w-xs bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
            >
              <option value="20">วันที่ 20</option>
              <option value="25">วันที่ 25</option>
              <option value="28">วันที่ 28</option>
            </select>
          </div>
        </div>

        {/* การตั้งค่าวันจ่ายเงิน */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <div>
            <h4 className="font-bold text-sm text-gray-900">การตั้งค่าวันจ่ายเงิน</h4>
            <p className="text-xs text-gray-400">Pay Day Settings</p>
          </div>
          <div className="pt-2">
            <label className="block text-xs text-gray-600 mb-1">วันจ่ายเงิน (Pay Day)</label>
            <select
              value={payDay}
              onChange={(e) => setPayDay(e.target.value)}
              className="w-full max-w-xs bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
            >
              <option value="28">วันที่ 28</option>
              <option value="30">วันที่ 30</option>
              <option value="31">สิ้นเดือน</option>
            </select>
          </div>
        </div>

        {/* ปุ่มบันทึกการตั้งค่า */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="bg-black text-white px-5 py-2.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition cursor-pointer"
          >
            บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </div>
  );
}