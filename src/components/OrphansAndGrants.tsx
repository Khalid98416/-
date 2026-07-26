import { useSchoolStore } from '../store';
import { HeartHandshake, Gift, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

export function OrphansAndGrants() {
  const { students, classes } = useSchoolStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'orphan' | 'grant'>('all');

  const specialStudents = useMemo(() => {
    return students.filter(s => s.isOrphan || s.isEligibleForGrant).filter(s => {
      const matchesSearch = s.name.includes(searchTerm) || (s.registrationNumber && s.registrationNumber.includes(searchTerm));
      const matchesFilter = 
        filterType === 'all' ? true :
        filterType === 'orphan' ? s.isOrphan :
        filterType === 'grant' ? s.isEligibleForGrant : true;
      return matchesSearch && matchesFilter;
    });
  }, [students, searchTerm, filterType]);

  const getClassInfo = (classId: string) => {
    const c = classes.find(c => c.id === classId);
    return c ? c.name : 'غير محدد';
  };

  return (
    <div className="p-8 h-full flex flex-col w-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-cairo text-slate-800 flex items-center gap-3">
          الأيتام والمنح
        </h1>
        <p className="text-slate-500 mt-1 font-sans text-sm">سجل خاص بالطلاب الأيتام والمستحقين للمنح المالية.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="البحث في السجل..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10 font-sans outline-none transition-colors"
            />
          </div>
          
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${filterType === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              الكل
            </button>
            <button 
              onClick={() => setFilterType('orphan')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer flex items-center gap-1 ${filterType === 'orphan' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <HeartHandshake className="w-4 h-4" /> الأيتام
            </button>
            <button 
              onClick={() => setFilterType('grant')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer flex items-center gap-1 ${filterType === 'grant' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Gift className="w-4 h-4" /> المنح
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-0">
          <table className="w-full text-right font-sans text-sm">
            <thead className="bg-slate-50 text-slate-500 sticky top-0 font-bold border-b border-slate-200 z-10">
              <tr>
                <th className="px-6 py-4">اسم الطالب</th>
                <th className="px-6 py-4">الصف والشعبة</th>
                <th className="px-6 py-4">الحالة الاجتماعية</th>
                <th className="px-6 py-4">تفاصيل المنحة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {specialStudents.length > 0 ? (
                specialStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {student.name}
                      <div className="text-xs font-normal text-slate-500 mt-1">
                        قيد: {student.registrationNumber || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{getClassInfo(student.classId)}</td>
                    <td className="px-6 py-4">
                      {student.isOrphan ? (
                        <div>
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold mb-1">
                            <HeartHandshake className="w-3.5 h-3.5" /> يتيم
                          </span>
                          <div className="text-xs text-slate-500">المتوفي: <span className="font-bold">{student.deceasedParent}</span></div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student.isEligibleForGrant ? (
                        <div>
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold mb-1">
                            <Gift className="w-3.5 h-3.5" /> مستحق منحة
                          </span>
                          <div className="text-xs text-slate-500">رقم الماستر كارد: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">{student.masterCardNumber || 'غير متوفر'}</span></div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    لا توجد بيانات مطابقة في السجل.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
