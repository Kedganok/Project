'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'แดชบอร์ด' },
    { href: '/transfers', label: 'รายการโอนเงิน' },
    { href: '/requests', label: 'คำขอจ่ายเงิน' },
    { href: '/pay-cycles', label: 'รอบการจ่ายเงิน' },
    { href: '/reports', label: 'รายงาน' },
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
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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
              </Link>
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
            <p className="text-xs text-gray-400">AF</p>
          </div>
        </div>
        <button onClick={() => alert('ออกจากระบบ')} className="text-gray-400 hover:text-white p-1">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};