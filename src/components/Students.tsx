import React, { useState, useMemo } from 'react';
import { useSchoolStore, Student } from '../store';
import { Plus, Edit2, Trash2, X, Search, HeartHandshake, Gift, User } from 'lucide-react';
import { motion } from 'motion/react';

const gradeLevels = [
  'الأول',
  'الثاني',
  'الثالث',
  'الرابع',
  'الخامس',
  'السادس'
];

export function Students() {
  const { students, classes, addStudent, updateStudent, deleteStudent } = useSchoolStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedGradeForm, setSelectedGradeForm] = useState(gradeLevels[0]);

  const availableSections = useMemo(() => {
    return classes
      .filter(c => c.name.includes(`الصف ${selectedGradeForm}`))
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }, [classes, selectedGradeForm]);

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGrade = e.target.value;
    setSelectedGradeForm(newGrade);
    const firstSection = classes
      .filter(c => c.name.includes(`الصف ${newGrade}`))
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'))[0];
    
    setFormData(prev => ({ ...prev, classId: firstSection ? firstSection.id : '' }));
  };

  // Form state
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    registrationNumber: '',
    dateOfBirth: '',
    motherName: '',
    classId: classes[0]?.id || '',
    parentPhone: '',
    isOrphan: false,
    deceasedParent: null,
    isEligibleForGrant: false,
    masterCardNumber: ''
  });

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.includes(searchTerm) || 
      (s.registrationNumber && s.registrationNumber.includes(searchTerm))
    );
  }, [students, searchTerm]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setSelectedGradeForm(gradeLevels[0]);
    const defaultClass = classes
      .filter(c => c.name.includes(`الصف ${gradeLevels[0]}`))
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'))[0];

    setFormData({
      name: '',
      registrationNumber: '',
      dateOfBirth: '',
      motherName: '',
      classId: defaultClass ? defaultClass.id : '',
      parentPhone: '',
      isOrphan: false,
      deceasedParent: null,
      isEligibleForGrant: false,
      masterCardNumber: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingId(student.id);
    
    const studentClass = classes.find(c => c.id === student.classId);
    let grade = gradeLevels[0];
    if (studentClass) {
      const foundGrade = gradeLevels.find(g => studentClass.name.includes(`الصف ${g}`));
      if (foundGrade) grade = foundGrade;
    }
    setSelectedGradeForm(grade);

    setFormData({
      name: student.name,
      registrationNumber: student.registrationNumber || '',
      dateOfBirth: student.dateOfBirth || '',
      motherName: student.motherName || '',
      classId: student.classId,
      parentPhone: student.parentPhone || '',
      isOrphan: student.isOrphan || false,
      deceasedParent: student.deceasedParent || null,
      isEligibleForGrant: student.isEligibleForGrant || false,
      masterCardNumber: student.masterCardNumber || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateStudent(editingId, formData);
    } else {
      addStudent({
        id: `s_${Date.now()}`,
        name: formData.name || '',
        classId: formData.classId || '',
        registrationNumber: formData.registrationNumber,
        dateOfBirth: formData.dateOfBirth,
        motherName: formData.motherName,
        parentPhone: formData.parentPhone,
        isOrphan: formData.isOrphan,
        deceasedParent: formData.isOrphan ? formData.deceasedParent : null,
        isEligibleForGrant: formData.isEligibleForGrant,
        masterCardNumber: formData.isEligibleForGrant ? formData.masterCardNumber : ''
      });
    }
    setIsModalOpen(false);
  };

  const getClassInfo = (classId: string) => {
    const c = classes.find(c => c.id === classId);
    return c ? c.name : 'غير محدد';
  };

  return (
    <div className="p-8 h-full flex flex-col w-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-cairo text-slate-800">الطلاب</h1>
          <p className="text-slate-500 mt-1 font-sans text-sm">إدارة بيانات الطلاب، السجلات الأكاديمية، والحضور</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold font-sans flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" /> إضافة طالب
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="البحث بالاسم أو رقم القيد..." 
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
                <th className="px-6 py-4">الاسم الرباعي واللقب</th>
                <th className="px-6 py-4">رقم القيد</th>
                <th className="px-6 py-4">الصف والشعبة</th>
                <th className="px-6 py-4">حالة خاصة</th>
                <th className="px-6 py-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{student.registrationNumber || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{getClassInfo(student.classId)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {student.isOrphan && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-bold">
                            <HeartHandshake className="w-3 h-3" /> يتيم
                          </span>
                        )}
                        {student.isEligibleForGrant && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-xs font-bold">
                            <Gift className="w-3 h-3" /> منحة
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(student)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteStudent(student.id)}
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
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
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
                {editingId ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="student-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الرباعي واللقب</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">رقم القيد</label>
                    <input 
                      type="text" 
                      value={formData.registrationNumber}
                      onChange={e => setFormData({...formData, registrationNumber: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ التولد</label>
                    <input 
                      type="date" 
                      value={formData.dateOfBirth}
                      onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">اسم الام</label>
                    <input 
                      type="text" 
                      value={formData.motherName}
                      onChange={e => setFormData({...formData, motherName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">الصف</label>
                      <select 
                        required
                        value={selectedGradeForm}
                        onChange={handleGradeChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                      >
                        {gradeLevels.map(grade => (
                          <option key={grade} value={grade}>الصف {grade}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">الشعبة</label>
                      <select 
                        required
                        value={formData.classId}
                        onChange={e => setFormData({...formData, classId: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                        disabled={availableSections.length === 0}
                      >
                        {availableSections.length > 0 ? (
                          availableSections.map(c => {
                            const sectionName = c.name.split('-')[1]?.trim() || c.name;
                            return <option key={c.id} value={c.id}>{sectionName}</option>;
                          })
                        ) : (
                          <option value="">لا توجد شعب</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">رقم هاتف ولي الامر</label>
                    <input 
                      type="tel" 
                      value={formData.parentPhone}
                      onChange={e => setFormData({...formData, parentPhone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-6">
                  {/* Orphan Section */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={formData.isOrphan}
                        onChange={e => setFormData({...formData, isOrphan: e.target.checked})}
                        className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="font-bold text-slate-800">هل التلميذ يتيم؟</span>
                    </label>
                    
                    {formData.isOrphan && (
                      <div className="mt-4 mr-8">
                        <label className="block text-sm font-bold text-slate-700 mb-2">من المتوفي؟</label>
                        <div className="flex gap-4">
                          {['الاب', 'الام', 'كلاهما'].map(option => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="deceasedParent"
                                value={option}
                                checked={formData.deceasedParent === option}
                                onChange={e => setFormData({...formData, deceasedParent: e.target.value as any})}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                              />
                              <span className="text-slate-600">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Grant Section */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={formData.isEligibleForGrant}
                        onChange={e => setFormData({...formData, isEligibleForGrant: e.target.checked})}
                        className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="font-bold text-slate-800">هل يستحق التلميذ المنحة؟</span>
                    </label>
                    
                    {formData.isEligibleForGrant && (
                      <div className="mt-4 mr-8">
                        <label className="block text-sm font-bold text-slate-700 mb-2">رقم الماستر كارد</label>
                        <input 
                          type="text" 
                          value={formData.masterCardNumber}
                          onChange={e => setFormData({...formData, masterCardNumber: e.target.value})}
                          className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                          placeholder="أدخل رقم الماستر كارد هنا..."
                        />
                      </div>
                    )}
                  </div>
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
                form="student-form"
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
