import React, { useState, useEffect } from 'react';
import { useSchoolStore, ScheduleItem } from '../../store';
import { Wand2, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const PERIODS = [1, 2, 3, 4, 5, 6];

export function Generator({ onComplete }: { onComplete: () => void }) {
  const { classes, assignments, subjectLessons, scheduleItems, setScheduleItems } = useSchoolStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const gradeLevels = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];

  const runGenerator = async () => {
    setIsGenerating(true);
    setProgress(10);
    setError(null);
    setSuccess(false);

    // Yield to let UI update
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // 1. Gather all required lessons to be placed
      let lessonsToPlace: { classId: string, subjectId: string, teacherId: string }[] = [];
      
      for (const assignment of assignments) {
        const cls = classes.find(c => c.id === assignment.classId);
        if (!cls) continue;
        const grade = gradeLevels.find(g => cls.name.includes(g));
        if (!grade) continue;
        
        const sl = subjectLessons.find(s => s.grade === grade && s.subjectId === assignment.subjectId);
        if (!sl) continue;

        for (let i = 0; i < sl.lessonsPerWeek; i++) {
          lessonsToPlace.push({
            classId: assignment.classId,
            subjectId: assignment.subjectId,
            teacherId: assignment.teacherId
          });
        }
      }

      if (lessonsToPlace.length === 0) {
        throw new Error("لا توجد حصص مسندة لتوليد الجدول. يرجى إسناد المواد أولاً.");
      }

      setProgress(30);

      // 2. Sort heuristic: Heaviest subjects first, then by constraints
      // Actually, standard greedy approach:
      // Shuffle slightly or sort by most constrained
      lessonsToPlace.sort((a, b) => {
        // Find total lessons per week for this subject to prioritize heavier ones
        const countA = lessonsToPlace.filter(l => l.subjectId === a.subjectId && l.classId === a.classId).length;
        const countB = lessonsToPlace.filter(l => l.subjectId === b.subjectId && l.classId === b.classId).length;
        return countB - countA;
      });

      const schedule: ScheduleItem[] = [];

      // Helper to check constraints
      const isValid = (day: string, period: number, item: typeof lessonsToPlace[0]) => {
        // Constraint 1: Teacher not in two places
        if (schedule.some(s => s.day === day && s.period === period && s.teacherId === item.teacherId)) {
          return false;
        }
        // Constraint 2: Class not having two lessons
        if (schedule.some(s => s.day === day && s.period === period && s.classId === item.classId)) {
          return false;
        }

        // Constraint 3: Max 1 per day if total <= 5. If > 5, max 2 per day, not consecutive.
        const totalLessonsPerWeek = lessonsToPlace.filter(l => l.subjectId === item.subjectId && l.classId === item.classId).length;
        const lessonsSameDay = schedule.filter(s => s.day === day && s.classId === item.classId && s.subjectId === item.subjectId);
        
        if (totalLessonsPerWeek <= 5) {
          if (lessonsSameDay.length > 0) return false;
        } else {
          if (lessonsSameDay.length >= 2) return false;
          // Not consecutive
          if (lessonsSameDay.some(s => Math.abs(s.period - period) === 1)) return false;
          // If it's the second lesson, prefer 5th or 6th period
          if (lessonsSameDay.length === 1 && period < 5) return false; // Hard constraint for heuristic
        }

        return true;
      };

      setProgress(50);
      let placedCount = 0;
      const totalLessons = lessonsToPlace.length;

      // 3. Simple greedy placement with basic retry
      // We iterate over lessons, and find the first valid slot.
      for (const item of lessonsToPlace) {
        let placed = false;
        // Try to find a slot
        // To spread evenly, start from a random day/period based on hash or just linear search
        const startDayIdx = Math.floor(Math.random() * DAYS.length);
        const startPeriodIdx = Math.floor(Math.random() * PERIODS.length);

        for (let d = 0; d < DAYS.length; d++) {
          const day = DAYS[(startDayIdx + d) % DAYS.length];
          for (let p = 0; p < PERIODS.length; p++) {
            const period = PERIODS[(startPeriodIdx + p) % PERIODS.length];
            
            if (isValid(day, period, item)) {
              schedule.push({
                id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                classId: item.classId,
                day,
                period,
                subjectId: item.subjectId,
                teacherId: item.teacherId
              });
              placed = true;
              break;
            }
          }
          if (placed) break;
        }

        if (!placed) {
          // In a real CSP solver we would backtrack here.
          // For this heuristic, we might fail to place some if the schedule is too packed or constraints too tight.
          console.warn("Could not place lesson", item);
        } else {
          placedCount++;
        }
        
        setProgress(50 + Math.floor((placedCount / totalLessons) * 40));
      }

      if (placedCount < totalLessons) {
        setError(`تم توليد الجدول جزئياً. تعذر تسكين ${totalLessons - placedCount} حصة بسبب تضارب المواعيد أو القيود. يرجى مراجعة أنصبة المعلمين أو تقليل القيود.`);
      }

      setScheduleItems(schedule);
      setProgress(100);
      setSuccess(true);
      
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع أثناء التوليد.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-slate-50 overflow-y-auto">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-10 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
          <Wand2 className="w-10 h-10" />
        </div>
        
        <h2 className="text-3xl font-bold font-cairo text-slate-800 mb-4">المولد الذكي للجداول</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          يقوم هذا المولد بإنشاء الجدول المدرسي الكامل باستخدام خوارزميات الذكاء الاصطناعي مع مراعاة القيود التالية:
          <br />• عدم تضارب مواعيد المعلمين
          <br />• توزيع عادل للحصص على أيام الأسبوع
          <br />• معالجة المواد ذات النصاب العالي (أكثر من 5 حصص)
        </p>

        {error && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-right">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-amber-800 font-bold">{error}</span>
          </div>
        )}

        {success && !error && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span className="text-emerald-800 font-bold text-lg">تم توليد الجدول بنجاح!</span>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={runGenerator}
            disabled={isGenerating}
            className="w-full sm:w-auto min-w-[250px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-xl font-bold font-sans text-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-3 shadow-lg shadow-blue-600/30"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                جاري التوليد...
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                {scheduleItems.length > 0 ? 'إعادة توليد الجدول' : 'بدء التوليد'}
              </>
            )}
          </button>
          
          {success && (
            <div className="block mt-4">
              <button
                onClick={onComplete}
                className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
              >
                الذهاب لعرض الجداول
              </button>
            </div>
          )}
        </div>

        {isGenerating && (
          <div className="mt-8 max-w-md mx-auto">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-slate-500 font-bold text-center">{progress}%</div>
          </div>
        )}
      </div>
    </div>
  );
}
