import { useState } from 'react';
import { useSchoolStore } from '../store';
import { Plus, Trash2, LayoutGrid, Layers } from 'lucide-react';
import { motion } from 'motion/react';

const gradeLevels = [
  'الأول',
  'الثاني',
  'الثالث',
  'الرابع',
  'الخامس',
  'السادس'
];

const sectionLetters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي'];

export function ClassesAndSections({ embedded = false }: { embedded?: boolean }) {
  const { classes, addClasses, deleteClass } = useSchoolStore();
  const [selectedGrade, setSelectedGrade] = useState(gradeLevels[0]);

  const handleAddClasses = (count: number) => {
    const newClasses = [];
    for (let i = 0; i < count; i++) {
      const sectionName = `الصف ${selectedGrade} - شعبة ${sectionLetters[i]}`;
      // Check if it already exists
      if (!classes.find(c => c.name === sectionName)) {
        newClasses.push({ id: `c_${Date.now()}_${i}`, name: sectionName });
      }
    }
    
    if (newClasses.length > 0) {
      addClasses(newClasses);
    }
  };

  // Group classes
  const groupedClasses = gradeLevels.map(grade => {
    return {
      grade: `الصف ${grade}`,
      sections: classes.filter(c => c.name.includes(`الصف ${grade}`))
    }
  }).filter(g => g.sections.length > 0);

  const otherClasses = classes.filter(c => !gradeLevels.some(grade => c.name.includes(`الصف ${grade}`)));

  return (
    <div className={`flex flex-col w-full h-full overflow-y-auto ${embedded ? 'p-6 bg-slate-50' : 'p-8'}`}>
      {!embedded && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-cairo text-slate-800">الصفوف والشعب</h1>
          <p className="text-slate-500 mt-1 font-sans text-sm">إضافة وإدارة الصفوف الدراسية وتوزيع الشعب</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Class Section */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-8">
            <h2 className="text-xl font-bold font-cairo text-slate-800 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> إضافة صف
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 font-sans">اختر الصف</label>
                <select 
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 font-sans outline-none transition-colors"
                >
                  {gradeLevels.map(grade => (
                    <option key={grade} value={grade}>الصف {grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 font-sans">عدد الشعب المطلوب</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <button
                      key={num}
                      onClick={() => handleAddClasses(num)}
                      className="py-2.5 px-1 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 font-bold font-sans text-slate-700 transition-colors shadow-sm cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-3 font-sans leading-relaxed">
                  اضغط على الرقم لإنشاء الشعب فوراً بالترتيب الأبجدي (أ، ب، ج...)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Classes List */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {groupedClasses.length === 0 && otherClasses.length === 0 ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100">
                <LayoutGrid className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold font-cairo text-slate-700 mb-1">لا توجد صفوف مضافة</h3>
              <p className="text-slate-500 font-sans text-sm">استخدم لوحة الإضافة لإنشاء صفوف وشعب جديدة.</p>
            </div>
          ) : (
            <>
              {groupedClasses.map((group) => (
                <div key={group.grade} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold font-cairo text-slate-800 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-600" /> {group.grade}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {group.sections.map(c => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={c.id} 
                        className="group relative bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-slate-300 transition-colors"
                      >
                        <span className="font-bold font-cairo text-slate-800 text-sm mb-1 text-center">{c.name}</span>
                        <button 
                          onClick={() => deleteClass(c.id)}
                          className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all shadow-sm border border-slate-100 cursor-pointer"
                          title="حذف الشعبة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}

              {otherClasses.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold font-cairo text-slate-800 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-slate-400" /> صفوف أخرى
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {otherClasses.map(c => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={c.id} 
                        className="group relative bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-slate-300 transition-colors"
                      >
                        <span className="font-bold font-cairo text-slate-800 text-sm mb-1 text-center">{c.name}</span>
                        <button 
                          onClick={() => deleteClass(c.id)}
                          className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all shadow-sm border border-slate-100 cursor-pointer"
                          title="حذف الصف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
