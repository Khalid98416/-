import React, { useState } from 'react';
import { ClassesAndSections } from '../ClassesAndSections';
import { Teachers } from '../Teachers';
import { SubjectsConfig } from './SubjectsConfig';
import { AssignmentsConfig } from './AssignmentsConfig';
import { Generator } from './Generator';
import { Viewer } from './Viewer';
import { Users, Briefcase, BookOpen, UserPlus, Wand2, CalendarDays } from 'lucide-react';

const steps = [
  { id: 1, label: 'الصفوف والشعب', icon: Users },
  { id: 2, label: 'المعلمين', icon: Briefcase },
  { id: 3, label: 'المواد والحصص', icon: BookOpen },
  { id: 4, label: 'إسناد المواد', icon: UserPlus },
  { id: 5, label: 'التوليد التلقائي', icon: Wand2 },
  { id: 6, label: 'عرض الجداول', icon: CalendarDays },
];

export function ScheduleMain() {
  const [activeStep, setActiveStep] = useState(1);

  const renderStepContent = () => {
    switch (activeStep) {
      case 1: return <ClassesAndSections embedded />;
      case 2: return <Teachers embedded />;
      case 3: return <SubjectsConfig />;
      case 4: return <AssignmentsConfig />;
      case 5: return <Generator onComplete={() => setActiveStep(6)} />;
      case 6: return <Viewer />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-8 pb-4 shrink-0 bg-white border-b border-slate-200">
        <h1 className="text-3xl font-bold font-cairo text-slate-800 mb-6">الجدول المدرسي</h1>
        
        <div className="flex flex-wrap gap-2">
          {steps.map(step => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${activeStep === step.id ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'}`}
            >
              <step.icon className="w-4 h-4" />
              <span>{step.id}. {step.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {renderStepContent()}
      </div>
    </div>
  );
}
