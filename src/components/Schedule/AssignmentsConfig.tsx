import React, { useState, useMemo } from 'react';
import { useSchoolStore } from '../../store';
import { UserPlus, Filter, CheckCircle2, BookOpen } from 'lucide-react';

const gradeLevels = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];

export function AssignmentsConfig() {
  const { classes, subjects, subjectLessons, teachers, assignments, setAssignments } = useSchoolStore();
  const [selectedGrade, setSelectedGrade] = useState(gradeLevels[0]);
  
  const gradeClasses = useMemo(() => {
    return classes.filter(c => c.name.includes(`الصف ${selectedGrade}`)).sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }, [classes, selectedGrade]);

  const [selectedClassId, setSelectedClassId] = useState<string>('');

  // Auto select first class when grade changes
  React.useEffect(() => {
    if (gradeClasses.length > 0 && (!selectedClassId || !gradeClasses.find(c => c.id === selectedClassId))) {
      setSelectedClassId(gradeClasses[0].id);
    }
  }, [gradeClasses, selectedClassId]);

  const requiredSubjects = useMemo(() => {
    return subjectLessons.filter(sl => sl.grade === selectedGrade);
  }, [subjectLessons, selectedGrade]);

  const handleAssignTeacher = (subjectId: string, teacherId: string) => {
    if (!selectedClassId) return;

    let newAssignments = [...assignments];
    const existingIndex = newAssignments.findIndex(a => a.classId === selectedClassId && a.subjectId === subjectId);

    if (existingIndex >= 0) {
      if (teacherId === '') {
        newAssignments.splice(existingIndex, 1);
      } else {
        newAssignments[existingIndex].teacherId = teacherId;
      }
    } else if (teacherId !== '') {
      newAssignments.push({
        id: `a_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        classId: selectedClassId,
        subjectId,
        teacherId
      });
    }

    setAssignments(newAssignments);
  };

  const getAssignedTeacherId = (subjectId: string) => {
    const assignment = assignments.find(a => a.classId === selectedClassId && a.subjectId === subjectId);
    return assignment ? assignment.teacherId : '';
  };

  // Helper to get total assignments for a teacher to display their load
  const getTeacherLoad = (teacherId: string) => {
    return assignments.filter(a => a.teacherId === teacherId).reduce((total, a) => {
      // Find the lessons per week for this assignment's class/subject
      const cls = classes.find(c => c.id === a.classId);
      if (!cls) return total;
      const grade = gradeLevels.find(g => cls.name.includes(g)) || '';
      const sl = subjectLessons.find(s => s.grade === grade && s.subjectId === a.subjectId);
      return total + (sl?.lessonsPerWeek || 0);
    }, 0);
  };

  return (
    <div className="flex flex-col w-full h-full p-6 bg-slate-50 overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-cairo text-slate-800">إسناد المواد للمعلمين</h2>
          <p className="text-slate-500 mt-1 font-sans text-sm">ربط كل مادة في الشعبة الدراسية بمعلم محدد.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Filter className="w-4 h-4 text-blue-600" /> اختر الصف</h3>
            <div className="flex flex-wrap gap-2">
              {gradeLevels.map(grade => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${selectedGrade === grade ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex-1 overflow-y-auto">
            <h3 className="font-bold text-slate-800 mb-3">الشعب الدراسية</h3>
            {gradeClasses.length > 0 ? (
              <div className="flex flex-col gap-2">
                {gradeClasses.map(c => {
                  // check if all subjects are assigned
                  const assignedCount = requiredSubjects.filter(rs => assignments.some(a => a.classId === c.id && a.subjectId === rs.subjectId)).length;
                  const isComplete = requiredSubjects.length > 0 && assignedCount === requiredSubjects.length;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedClassId(c.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors text-right ${selectedClassId === c.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
                    >
                      <span className="font-bold text-slate-800">{c.name}</span>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{assignedCount} / {requiredSubjects.length}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8 text-sm">
                لا توجد شعب مسجلة لهذا الصف.
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-y-auto">
          {selectedClassId ? (
            <>
              <h3 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                المواد المطلوبة - {classes.find(c => c.id === selectedClassId)?.name}
              </h3>
              
              {requiredSubjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requiredSubjects.map(rs => {
                    const subject = subjects.find(s => s.id === rs.subjectId);
                    if (!subject) return null;
                    const currentTeacherId = getAssignedTeacherId(rs.subjectId);

                    return (
                      <div key={rs.subjectId} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <div className="font-bold text-slate-800">{subject.name}</div>
                          <div className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">{rs.lessonsPerWeek} حصص</div>
                        </div>
                        <div>
                          <select
                            value={currentTeacherId}
                            onChange={(e) => handleAssignTeacher(rs.subjectId, e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm"
                          >
                            <option value="">-- اختر معلم --</option>
                            {teachers.map(t => {
                              const load = getTeacherLoad(t.id);
                              return (
                                <option key={t.id} value={t.id}>{t.name} (النصاب: {load})</option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-12">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>لم يتم تحديد حصص لهذا الصف بعد.</p>
                  <p className="text-sm mt-2">يرجى الذهاب إلى تبويب "المواد والحصص" أولاً.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              يرجى اختيار شعبة لعرض وإسناد المواد
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
