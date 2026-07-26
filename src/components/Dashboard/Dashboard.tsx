import { useMemo, useState, useEffect } from 'react';
import { Users, UserCheck, LayoutGrid, CalendarClock, AlertCircle } from 'lucide-react';
import { useSchoolStore } from '../../store';
import { StatCard } from './StatCard';
import { WeeklyLessonsBarChart } from './WeeklyLessonsBarChart';
import { SubjectsDonutChart } from './SubjectsDonutChart';
import { TeacherLoadChart } from './TeacherLoadChart';
import { DashboardSkeleton } from './DashboardSkeleton';

export function Dashboard() {
  const { students, teachers, classes, lessons, subjects, isLoading, error } = useSchoolStore();
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration errors / ensure Recharts runs on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Derived Statistics
  const totalStudents = useMemo(() => students.length, [students]);
  const totalTeachers = useMemo(() => teachers.length, [teachers]);
  const totalClasses = useMemo(() => classes.length, [classes]);
  const totalLessons = useMemo(() => lessons.length, [lessons]);
  
  const avgLessonsPerTeacher = useMemo(() => {
    if (totalTeachers === 0) return 0;
    return (totalLessons / totalTeachers).toFixed(1);
  }, [totalLessons, totalTeachers]);

  // Derived Data for Charts
  const weeklyLessonsData = useMemo(() => {
    const daysOrder = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    const counts = daysOrder.map(day => ({
      name: day,
      count: lessons.filter(l => l.day === day).length
    }));
    return counts;
  }, [lessons]);

  const subjectsDistributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    lessons.forEach(l => {
      counts[l.subjectId] = (counts[l.subjectId] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([subjectId, count]) => {
        const subject = subjects.find(s => s.id === subjectId);
        return {
          name: subject ? subject.name : 'أخرى',
          value: count
        };
      })
      .sort((a, b) => b.value - a.value); // Sort descending
  }, [lessons, subjects]);

  const teacherLoadData = useMemo(() => {
    const counts: Record<string, number> = {};
    lessons.forEach(l => {
      counts[l.teacherId] = (counts[l.teacherId] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([teacherId, count]) => {
        const teacher = teachers.find(t => t.id === teacherId);
        return {
          name: teacher ? teacher.name : 'غير معروف',
          lessons: count
        };
      })
      .sort((a, b) => b.lessons - a.lessons)
      .slice(0, 5); // Top 5
  }, [lessons, teachers]);

  if (!isClient || isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm flex flex-col items-center max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-signal-coral mb-4" />
          <h3 className="text-xl font-bold font-cairo text-ink mb-2">حدث خطأ أثناء تحميل البيانات</h3>
          <p className="text-slate-500 font-sans mb-6">{error}</p>
          <button className="bg-academic-indigo text-white px-6 py-2.5 rounded-xl font-sans font-medium hover:bg-opacity-90 transition-all">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (totalStudents === 0 && totalTeachers === 0) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="bg-white p-8 rounded-2xl border border-border-light shadow-sm flex flex-col items-center max-w-md text-center">
          <LayoutGrid className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold font-cairo text-ink mb-2">لا توجد بيانات</h3>
          <p className="text-slate-500 font-sans mb-6">لم يتم إدخال بيانات المدرسة بعد. يرجى البدء بإضافة الطلاب والمعلمين.</p>
          <button className="bg-academic-indigo text-white px-6 py-2.5 rounded-xl font-sans font-medium hover:bg-opacity-90 transition-all">
            الذهاب إلى الإعدادات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full flex flex-col w-full bg-canvas text-ink">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-cairo text-ink">لوحة تحكم المدرسة</h1>
          <p className="text-slate-500 mt-1 font-sans text-sm">نظرة عامة على الأداء والموارد للعام الدراسي الحالي</p>
        </div>
        
        <div className="flex items-center">
          <select className="bg-white border border-border-light text-ink text-sm rounded-xl focus:ring-academic-indigo focus:border-academic-indigo block w-full p-2.5 font-sans font-medium outline-none cursor-pointer hover:border-slate-300 transition-colors shadow-sm">
            <option>الفصل الدراسي الأول</option>
            <option>الفصل الدراسي الثاني</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard 
          title="عدد الطلاب" 
          value={totalStudents} 
          icon={Users} 
          colorClass="bg-[#24345F]" // Academic Indigo
        />
        <StatCard 
          title="عدد المعلمين" 
          value={totalTeachers} 
          icon={UserCheck} 
          colorClass="bg-[#1F9E89]" // Growth Teal
        />
        <StatCard 
          title="عدد الصفوف / الشعب" 
          value={totalClasses} 
          icon={LayoutGrid} 
          colorClass="bg-[#475569]" // Slate
        />
        <StatCard 
          title="الحصص الأسبوعية" 
          value={totalLessons} 
          icon={CalendarClock} 
          colorClass="bg-[#E8A33D]" // Merit Gold
        />
        <StatCard 
          title="متوسط الحصص لكل معلم" 
          value={avgLessonsPerTeacher} 
          icon={UserCheck} 
          colorClass="bg-[#E8604C]" // Signal Coral
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <WeeklyLessonsBarChart data={weeklyLessonsData} />
        <SubjectsDonutChart data={subjectsDistributionData} totalLessons={totalLessons} />
      </div>
      
      {/* Optional Top Teachers Load */}
      {teacherLoadData.length > 0 && (
        <div className="mb-6">
          <TeacherLoadChart data={teacherLoadData} />
        </div>
      )}
    </div>
  );
}
