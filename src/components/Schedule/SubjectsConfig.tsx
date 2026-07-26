import React, { useState } from 'react';
import { useSchoolStore, SubjectLesson } from '../../store';
import { BookOpen, Plus, Trash2, Search } from 'lucide-react';
import { motion } from 'motion/react';

const gradeLevels = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];

export function SubjectsConfig() {
  const { subjects, subjectLessons, setSubjectLessons } = useSchoolStore();
  const [selectedGrade, setSelectedGrade] = useState(gradeLevels[0]);

  const currentGradeLessons = subjectLessons.filter(sl => sl.grade === selectedGrade);

  const handleUpdateLesson = (subjectId: string, lessonsPerWeek: number) => {
    let newLessons = [...subjectLessons];
    const existingIndex = newLessons.findIndex(sl => sl.grade === selectedGrade && sl.subjectId === subjectId);
    
    if (existingIndex >= 0) {
      if (lessonsPerWeek <= 0) {
        newLessons.splice(existingIndex, 1);
      } else {
        newLessons[existingIndex].lessonsPerWeek = lessonsPerWeek;
      }
    } else if (lessonsPerWeek > 0) {
      newLessons.push({
        id: `sl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        grade: selectedGrade,
        subjectId,
        lessonsPerWeek
      });
    }
    
    setSubjectLessons(newLessons);
  };

  return (
    <div className="flex flex-col w-full h-full p-6 bg-slate-50 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-cairo text-slate-800">المواد والحصص</h2>
        <p className="text-slate-500 mt-1 font-sans text-sm">تحديد المواد وعدد الحصص الأسبوعية لكل صف دراسي.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-48 shrink-0 flex md:flex-col gap-2 overflow-x-auto pb-2">
          {gradeLevels.map(grade => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-colors flex items-center justify-center ${selectedGrade === grade ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              الصف {grade}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map(subject => {
              const currentVal = currentGradeLessons.find(sl => sl.subjectId === subject.id)?.lessonsPerWeek || 0;
              return (
                <div key={subject.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800">{subject.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleUpdateLesson(subject.id, currentVal - 1)}
                      disabled={currentVal === 0}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold font-sans">{currentVal}</span>
                    <button 
                      onClick={() => handleUpdateLesson(subject.id, currentVal + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
