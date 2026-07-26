import React, { useState, useMemo } from 'react';
import { useSchoolStore, Teacher } from '../store';
import { Plus, Edit2, Trash2, X, Search, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

const maritalStatusOptions = ['متزوج', 'أعزب', 'أرمل', 'مطلق'];
const educationOptions = ['دورة تربوية', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه'];
const specializationOptions = ['إسلامية', 'عربي', 'رياضيات', 'علوم', 'إنجليزي', 'اجتماعيات', 'صفوف أولية', 'فنية', 'رياضة'];

export function Teachers({ embedded = false }: { embedded?: boolean }) {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useSchoolStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Teacher>>({
    name: '',
    jobTitle: '',
    maritalStatus: maritalStatusOptions[0],
    education: educationOptions[0],
    specialization: specializationOptions[0],
    graduationEntity: '',
    firstCommencementDate: '',
    currentSchoolCommencementDate: ''
  });

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => 
      t.name.includes(searchTerm) || 
      (t.jobTitle && t.jobTitle.includes(searchTerm))
    );
  }, [teachers, searchTerm]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      jobTitle: '',
      maritalStatus: maritalStatusOptions[0],
      education: educationOptions[0],
      specialization: specializationOptions[0],
      graduationEntity: '',
      firstCommencementDate: '',
      currentSchoolCommencementDate: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setFormData({
      name: teacher.name,
      jobTitle: teacher.jobTitle || '',
      maritalStatus: teacher.maritalStatus || maritalStatusOptions[0],
      education: teacher.education || educationOptions[0],
      specialization: teacher.specialization || specializationOptions[0],
      graduationEntity: teacher.graduationEntity || '',
      firstCommencementDate: teacher.firstCommencementDate || '',
      currentSchoolCommencementDate: teacher.currentSchoolCommencementDate || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTeacher(editingId, formData);
    } else {
      addTeacher({
        id: `t_${Date.now()}`,
        name: formData.name || '',
        jobTitle: formData.jobTitle,
        maritalStatus: formData.maritalStatus,
        education: formData.education,
        specialization: formData.specialization,
        graduationEntity: formData.graduationEntity,
        firstCommencementDate: formData.firstCommencementDate,
        currentSchoolCommencementDate: formData.currentSchoolCommencementDate
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className={`flex flex-col w-full h-full overflow-y-auto ${embedded ? 'p-6 bg-slate-50' : 'p-8'}`}>
      <div className={`flex justify-between items-center ${embedded ? 'mb-6' : 'mb-8'}`}>
        {!embedded ? (
          <div>
            <h1 className="text-3xl font-bold font-cairo text-slate-800">المعلمين</h1>
            <p className="text-slate-500 mt-1 font-sans text-sm">إدارة بيانات المعلمين والكادر التدريسي</p>
          </div>
        ) : (
          <h2 className="text-2xl font-bold font-cairo text-slate-800">إدارة المعلمين</h2>
        )}
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold font-sans flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" /> إضافة معلم
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="البحث بالاسم أو العنوان الوظيفي..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10 font-sans outline-none transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-0">
          <table className="w-full text-right font-sans text-sm">
            <thead className="bg-slate-50 text-slate-500 sticky top-0 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">الاسم الكامل</th>
                {!embedded && (
                  <>
                    <th className="px-6 py-4">العنوان الوظيفي</th>
                    <th className="px-6 py-4">الاختصاص</th>
                    <th className="px-6 py-4">التحصيل الدراسي</th>
                  </>
                )}
                <th className="px-6 py-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      {teacher.name}
                    </td>
                    {!embedded && (
                      <>
                        <td className="px-6 py-4 text-slate-600">{teacher.jobTitle || '-'}</td>
                        <td className="px-6 py-4 text-slate-600">{teacher.specialization || '-'}</td>
                        <td className="px-6 py-4 text-slate-600">{teacher.education || '-'}</td>
                      </>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(teacher)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteTeacher(teacher.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={embedded ? 2 : 5} className="px-6 py-12 text-center text-slate-500">
                    لا توجد بيانات مطابقة للبحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold font-cairo text-slate-800">
                {editingId ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="teacher-form" onSubmit={handleSubmit} className="space-y-6">
                <div className={`grid grid-cols-1 ${embedded ? '' : 'md:grid-cols-2'} gap-6`}>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الكامل</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                    />
                  </div>
                  {!embedded && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الوظيفي</label>
                        <input 
                          type="text" 
                          required={!embedded}
                          value={formData.jobTitle}
                          onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">الحالة الاجتماعية</label>
                        <select 
                          required={!embedded}
                          value={formData.maritalStatus}
                          onChange={e => setFormData({...formData, maritalStatus: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                        >
                          {maritalStatusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">التحصيل الدراسي</label>
                        <select 
                          required={!embedded}
                          value={formData.education}
                          onChange={e => setFormData({...formData, education: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                        >
                          {educationOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">الاختصاص</label>
                        <select 
                          required={!embedded}
                          value={formData.specialization}
                          onChange={e => setFormData({...formData, specialization: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                        >
                          {specializationOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">جهة التخرج</label>
                        <input 
                          type="text" 
                          required={!embedded}
                          value={formData.graduationEntity}
                          onChange={e => setFormData({...formData, graduationEntity: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ المباشرة لأول مرة</label>
                        <input 
                          type="date" 
                          required={!embedded}
                          value={formData.firstCommencementDate}
                          onChange={e => setFormData({...formData, firstCommencementDate: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ المباشرة بالمدرسة الحالية</label>
                        <input 
                          type="date" 
                          required={!embedded}
                          value={formData.currentSchoolCommencementDate}
                          onChange={e => setFormData({...formData, currentSchoolCommencementDate: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-10 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold font-sans text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button 
                form="teacher-form"
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold font-sans transition-colors cursor-pointer"
              >
                حفظ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
