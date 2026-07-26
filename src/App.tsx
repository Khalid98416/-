import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ClassesAndSections } from './components/ClassesAndSections';
import { Students } from './components/Students';
import { Teachers } from './components/Teachers';
import { Settings } from './components/Settings';
import { OrphansAndGrants } from './components/OrphansAndGrants';
import { ScheduleMain } from './components/Schedule/ScheduleMain';
import { PlaceholderView } from './components/PlaceholderView';
import { TabType } from './types';
import { useSchoolStore } from './store';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { settings } = useSchoolStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Students />;
      case 'teachers':
        return <Teachers />;
      case 'classes':
        return <ClassesAndSections />;
      case 'documents':
        return <PlaceholderView title="الكتب الرسمية" description="نظام إدارة الصادر والوارد والكتب الرسمية والمراسلات." />;
      case 'schedule':
        return <ScheduleMain />;
      case 'seating':
        return <PlaceholderView title="خرائط الجلوس" description="توزيع الطلاب على الصفوف وقاعات الامتحان بشكل هندسي." />;
      case 'archive':
        return <PlaceholderView title="الأرشيف" description="أرشيف السنوات السابقة والملفات القديمة لسهولة الرجوع إليها." />;
      case 'inventory':
        return <PlaceholderView title="المخزن" description="إدارة مخزن المدرسة والقرطاسية والكتب والمعدات." />;
      case 'questions':
        return <PlaceholderView title="منشئ الأسئلة" description="أداة ذكية لتوليد الأسئلة الامتحانية والنماذج الاختبارية." />;
      case 'exams':
        return <PlaceholderView title="الامتحانات" description="إدارة الامتحانات والنتائج والدرجات وإصدار الشهادات." />;
      case 'orphans_grants':
        return <OrphansAndGrants />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const isDarkMode = settings.theme === 'dark' || (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div 
      className={`flex h-screen ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300`}
      style={{ fontFamily: settings.font !== 'system-ui' ? `'${settings.font}', sans-serif` : 'system-ui' }}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} overflow-hidden transition-colors duration-300`}>
        {/* Header could go here, but keeping it simple for now, we will add the header based on the bento grid */}
        <header className={`h-16 border-b ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'} flex items-center justify-between px-8 shrink-0 transition-colors duration-300`}>
          <div className="flex items-center gap-4">
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>مرحباً بك،</span>
            <span className={`font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{settings.principalName}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative text-sm font-bold opacity-70">
              {settings.schoolName} ({settings.academicYear})
            </div>
            <div className="w-px h-6 bg-slate-300 mx-2"></div>
            <div className="relative">
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-xl">🔔</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
