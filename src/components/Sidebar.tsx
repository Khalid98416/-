import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  LayoutGrid,
  FileText,
  Calendar,
  Map,
  Archive,
  Package,
  Wand2,
  ClipboardList,
  Settings,
  HeartHandshake
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const navItems: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'لوحة القيادة', icon: LayoutDashboard },
  { id: 'students', label: 'الطلاب', icon: Users },
  { id: 'teachers', label: 'المعلمين', icon: UserCheck },
  { id: 'classes', label: 'الصفوف والشعب', icon: LayoutGrid },
  { id: 'documents', label: 'الكتب الرسمية', icon: FileText },
  { id: 'schedule', label: 'جدول المدرسة', icon: Calendar },
  { id: 'seating', label: 'خرائط الجلوس', icon: Map },
  { id: 'archive', label: 'الأرشيف', icon: Archive },
  { id: 'inventory', label: 'المخزن', icon: Package },
  { id: 'questions', label: 'منشئ الأسئلة', icon: Wand2 },
  { id: 'exams', label: 'الامتحانات', icon: ClipboardList },
  { id: 'orphans_grants', label: 'الأيتام والمنح', icon: HeartHandshake },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shrink-0 border-l border-slate-800">
      <div className="p-6 mb-2">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">
            م
          </span>
          مدرستي
        </h1>
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-start text-sm ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-medium'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800 rounded-xl transition-all text-sm cursor-pointer">
          <Settings className="w-5 h-5 text-slate-400" />
          <span>الإعدادات</span>
        </div>
      </div>
    </aside>
  );
}
