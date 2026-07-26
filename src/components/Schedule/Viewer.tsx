import React, { useState, useMemo } from 'react';
import { useSchoolStore } from '../../store';
import { LayoutGrid, Users, Briefcase, UserPlus, BarChart3, Search, Printer, Download, CalendarDays } from 'lucide-react';

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const PERIODS = [1, 2, 3, 4, 5, 6];

export function Viewer() {
  const { classes, teachers, subjects, scheduleItems, assignments, subjectLessons } = useSchoolStore();
  const [activeTab, setActiveTab] = useState<'full' | 'class' | 'teacher' | 'substitute' | 'loads'>('full');
  
  // Specific filters
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [subDay, setSubDay] = useState(DAYS[0]);
  const [subPeriod, setSubPeriod] = useState(1);

  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || '';
  const getTeacherName = (id: string) => teachers.find(t => t.id === id)?.name || '';
  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || '';

  const renderFullSchedule = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse font-sans text-sm min-w-[800px]">
          <thead>
            <tr>
              <th className="border border-slate-200 bg-slate-100 p-2 font-bold w-32">الصف / اليوم</th>
              {DAYS.map(day => (
                <th key={day} className="border border-slate-200 bg-slate-100 p-2 font-bold" colSpan={PERIODS.length}>{day}</th>
              ))}
            </tr>
            <tr>
              <th className="border border-slate-200 bg-slate-50 p-2"></th>
              {DAYS.map(day => (
                PERIODS.map(p => (
                  <th key={`${day}-${p}`} className="border border-slate-200 bg-slate-50 p-1 text-xs">{p}</th>
                ))
              ))}
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => (
              <tr key={cls.id}>
                <td className="border border-slate-200 p-2 font-bold bg-slate-50 text-right">{cls.name}</td>
                {DAYS.map(day => (
                  PERIODS.map(p => {
                    const item = scheduleItems.find(s => s.classId === cls.id && s.day === day && s.period === p);
                    return (
                      <td key={`${cls.id}-${day}-${p}`} className="border border-slate-200 p-1 min-w-[60px] max-w-[80px]">
                        {item ? (
                          <div className="flex flex-col text-xs gap-1">
                            <span className="font-bold text-blue-700 truncate">{getSubjectName(item.subjectId)}</span>
                            <span className="text-slate-500 truncate text-[10px]">{getTeacherName(item.teacherId)}</span>
                          </div>
                        ) : <span className="text-slate-300">-</span>}
                      </td>
                    );
                  })
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderClassSchedule = () => {
    if (!selectedClass && classes.length > 0) {
      setSelectedClass(classes[0].id);
    }
    return (
      <div>
        <div className="mb-4 flex items-center gap-4">
          <label className="font-bold text-slate-700">اختر الشعبة:</label>
          <select 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-blue-500"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {selectedClass && (
          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
            <table className="w-full text-center border-collapse font-sans text-sm">
              <thead>
                <tr>
                  <th className="border-b border-l border-slate-200 bg-slate-100 p-3 font-bold w-32">اليوم / الحصة</th>
                  {PERIODS.map(p => (
                    <th key={p} className="border-b border-l last:border-l-0 border-slate-200 bg-slate-100 p-3 font-bold">الحصة {p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => (
                  <tr key={day}>
                    <td className="border-b border-l border-slate-200 p-3 font-bold bg-slate-50">{day}</td>
                    {PERIODS.map(p => {
                      const item = scheduleItems.find(s => s.classId === selectedClass && s.day === day && s.period === p);
                      return (
                        <td key={`${day}-${p}`} className="border-b border-l last:border-l-0 border-slate-200 p-3">
                          {item ? (
                            <div className="flex flex-col gap-1 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                              <span className="font-bold text-blue-800">{getSubjectName(item.subjectId)}</span>
                              <span className="text-slate-600 text-xs">{getTeacherName(item.teacherId)}</span>
                            </div>
                          ) : <span className="text-slate-300">-</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderTeacherSchedule = () => {
    if (!selectedTeacher && teachers.length > 0) {
      setSelectedTeacher(teachers[0].id);
    }
    return (
      <div>
        <div className="mb-4 flex items-center gap-4">
          <label className="font-bold text-slate-700">اختر المعلم:</label>
          <select 
            value={selectedTeacher} 
            onChange={e => setSelectedTeacher(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-blue-500 min-w-[200px]"
          >
            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {selectedTeacher && (
          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
            <table className="w-full text-center border-collapse font-sans text-sm">
              <thead>
                <tr>
                  <th className="border-b border-l border-slate-200 bg-slate-100 p-3 font-bold w-32">اليوم / الحصة</th>
                  {PERIODS.map(p => (
                    <th key={p} className="border-b border-l last:border-l-0 border-slate-200 bg-slate-100 p-3 font-bold">الحصة {p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => (
                  <tr key={day}>
                    <td className="border-b border-l border-slate-200 p-3 font-bold bg-slate-50">{day}</td>
                    {PERIODS.map(p => {
                      const item = scheduleItems.find(s => s.teacherId === selectedTeacher && s.day === day && s.period === p);
                      return (
                        <td key={`${day}-${p}`} className="border-b border-l last:border-l-0 border-slate-200 p-3 h-20">
                          {item ? (
                            <div className="flex flex-col gap-1 bg-emerald-50 p-2 rounded-lg border border-emerald-100 h-full justify-center">
                              <span className="font-bold text-emerald-800">{getClassName(item.classId)}</span>
                              <span className="text-slate-600 text-xs">{getSubjectName(item.subjectId)}</span>
                            </div>
                          ) : <span className="text-slate-300">فراغ</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderSubstitute = () => {
    // Find teachers who are NOT teaching at subDay and subPeriod
    const busyTeacherIds = new Set(
      scheduleItems.filter(s => s.day === subDay && s.period === subPeriod).map(s => s.teacherId)
    );
    const availableTeachers = teachers.filter(t => !busyTeacherIds.has(t.id));

    return (
      <div>
        <div className="mb-6 flex flex-wrap gap-6 bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <label className="font-bold text-slate-700">اليوم:</label>
            <select 
              value={subDay} 
              onChange={e => setSubDay(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:border-blue-500"
            >
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-bold text-slate-700">الحصة:</label>
            <select 
              value={subPeriod} 
              onChange={e => setSubPeriod(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:border-blue-500"
            >
              {PERIODS.map(p => <option key={p} value={p}>الحصة {p}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800">
            المعلمون المتفرغون (لا يوجد لديهم حصة في هذا الوقت): {availableTeachers.length}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {availableTeachers.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.specialization || 'غير محدد'}</div>
                </div>
                <div className="mr-auto">
                  <span className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">متفرغ ✅</span>
                </div>
              </div>
            ))}
            {availableTeachers.length === 0 && (
              <div className="col-span-full text-center py-8 text-slate-500">
                لا يوجد معلمون متفرغون في هذا الوقت.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLoads = () => {
    // Calculate load for each teacher from assignments
    const gradeLevelsStr = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];
    
    const teacherStats = teachers.map(t => {
      let totalLoad = 0;
      let assignedLessons = 0; // The actual generated schedule items count
      
      const teacherAssignments = assignments.filter(a => a.teacherId === t.id);
      
      teacherAssignments.forEach(a => {
        const cls = classes.find(c => c.id === a.classId);
        if (!cls) return;
        const grade = gradeLevelsStr.find(g => cls.name.includes(g)) || '';
        const sl = subjectLessons.find(s => s.grade === grade && s.subjectId === a.subjectId);
        if (sl) totalLoad += sl.lessonsPerWeek;
      });

      const dayCounts = DAYS.reduce((acc, day) => {
        acc[day] = scheduleItems.filter(s => s.teacherId === t.id && s.day === day).length;
        assignedLessons += acc[day];
        return acc;
      }, {} as Record<string, number>);

      return {
        ...t,
        totalLoad,
        assignedLessons,
        dayCounts
      };
    }).sort((a, b) => b.totalLoad - a.totalLoad);

    return (
      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-right border-collapse font-sans text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-700">المعلم</th>
              <th className="p-4 font-bold text-slate-700">النصاب الكلي</th>
              <th className="p-4 font-bold text-slate-700">مسكن بالجدول</th>
              {DAYS.map(d => (
                <th key={d} className="p-4 font-bold text-slate-600 text-center">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teacherStats.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-800">
                  {t.name}
                  <div className="text-xs font-normal text-slate-500 mt-0.5">{t.specialization}</div>
                </td>
                <td className="p-4">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">{t.totalLoad} حصة</span>
                </td>
                <td className="p-4">
                  <span className={`inline-block px-3 py-1 rounded-full font-bold ${t.assignedLessons < t.totalLoad ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {t.assignedLessons} حصة
                  </span>
                </td>
                {DAYS.map(day => (
                  <td key={day} className="p-4 text-center">
                    {t.dayCounts[day] > 0 ? (
                      <span className="font-bold text-slate-700">{t.dayCounts[day]}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (scheduleItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-8 text-slate-400">
        <CalendarDays className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg">لم يتم توليد أي جدول بعد.</p>
        <p className="text-sm">يرجى الذهاب إلى تبويب "التوليد التلقائي" لإنشاء الجدول.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'full', label: 'الجدول الكامل', icon: LayoutGrid },
    { id: 'class', label: 'جدول شعبة', icon: Users },
    { id: 'teacher', label: 'جدول معلم', icon: Briefcase },
    { id: 'substitute', label: 'سد الشاغر', icon: UserPlus },
    { id: 'loads', label: 'الأنصبة والتوزيع', icon: BarChart3 },
  ] as const;

  return (
    <div className="flex flex-col w-full h-full p-6 bg-slate-50 overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold font-cairo text-slate-800">عرض الجداول الدراسية</h2>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold font-sans text-sm flex items-center gap-2 transition-colors">
            <Printer className="w-4 h-4" /> طباعة
          </button>
          <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold font-sans text-sm flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> تصدير PDF
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${activeTab === tab.id ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-transparent rounded-3xl pb-10">
        {activeTab === 'full' && renderFullSchedule()}
        {activeTab === 'class' && renderClassSchedule()}
        {activeTab === 'teacher' && renderTeacherSchedule()}
        {activeTab === 'substitute' && renderSubstitute()}
        {activeTab === 'loads' && renderLoads()}
      </div>
    </div>
  );
}
