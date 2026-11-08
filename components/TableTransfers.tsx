import React from 'react';
import { TransferItem } from '@/types/finance';

interface TableTransfersProps {
  items: TransferItem[];
  onToggleStatus?: (id: string) => void;
}

export const TableTransfers: React.FC<TableTransfersProps> = ({ items, onToggleStatus }) => {
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
            <td colSpan={6} className="py-8 text-center text-gray-400">
              ไม่พบรายการโอนเงิน
            </td>
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
                    onClick={() => onToggleStatus && onToggleStatus(item.id)}
                    title="กดเพื่อยืนยันอนุมัติ"
                    className="px-3 py-1 rounded-md text-[11px] border border-gray-300 text-gray-600 bg-white hover:bg-black hover:text-white transition cursor-pointer inline-block"
                  >
                    รอตรวจสอบ
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleStatus && onToggleStatus(item.id)}
                    title="กดเพื่อยกเลิกการอนุมัติ"
                    className="px-3 py-1 rounded-md text-[11px] font-medium bg-black text-white hover:bg-red-600 transition cursor-pointer inline-block"
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
};