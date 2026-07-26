import { create } from 'zustand';

export interface Student {
  id: string;
  name: string;
  classId: string;
  registrationNumber?: string;
  dateOfBirth?: string;
  motherName?: string;
  parentPhone?: string;
  isOrphan?: boolean;
  deceasedParent?: 'الاب' | 'الام' | 'كلاهما' | null;
  isEligibleForGrant?: boolean;
  masterCardNumber?: string;
}

export interface Teacher {
  id: string;
  name: string;
  jobTitle?: string;
  maritalStatus?: string;
  education?: string;
  specialization?: string;
  graduationEntity?: string;
  firstCommencementDate?: string;
  currentSchoolCommencementDate?: string;
}

export interface ClassSection {
  id: string;
  name: string;
}

export interface Lesson {
  id: string;
  day: string;
  subjectId: string;
  teacherId: string;
  classId: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Settings {
  schoolName: string;
  principalName: string;
  academicYear: string;
  theme: 'light' | 'dark' | 'auto';
  font: string;
}

export interface SubjectLesson {
  id: string;
  grade: string;
  subjectId: string;
  lessonsPerWeek: number;
}

export interface Assignment {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
}

export interface ScheduleItem {
  id: string;
  classId: string;
  day: string;
  period: number;
  subjectId: string;
  teacherId: string;
}

interface SchoolStore {
  students: Student[];
  teachers: Teacher[];
  classes: ClassSection[];
  lessons: Lesson[];
  subjects: Subject[];
  subjectLessons: SubjectLesson[];
  assignments: Assignment[];
  scheduleItems: ScheduleItem[];
  settings: Settings;
  isLoading: boolean;
  error: string | null;
  setStoreData: (data: Partial<SchoolStore>) => void;
  addClasses: (newClasses: ClassSection[]) => void;
  deleteClass: (id: string) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: string, data: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setSubjectLessons: (subjectLessons: SubjectLesson[]) => void;
  setAssignments: (assignments: Assignment[]) => void;
  setScheduleItems: (scheduleItems: ScheduleItem[]) => void;
}

const subjects = [
  { id: 'sub0', name: 'الرياضيات' },
  { id: 'sub1', name: 'العلوم' },
  { id: 'sub2', name: 'اللغة العربية' },
  { id: 'sub3', name: 'اللغة الإنجليزية' },
  { id: 'sub4', name: 'الاجتماعيات' },
  { id: 'sub5', name: 'التربية الإسلامية' },
  { id: 'sub6', name: 'الحاسوب' },
];

export const useSchoolStore = create<SchoolStore>((set) => ({
  students: [],
  teachers: [],
  classes: [],
  lessons: [],
  subjects: subjects,
  subjectLessons: [],
  assignments: [],
  scheduleItems: [],
  settings: {
    schoolName: 'مدرسة المستقبل المشرق',
    principalName: 'محمد أحمد',
    academicYear: '2023-2024',
    theme: 'auto',
    font: 'Cairo',
  },
  isLoading: false,
  error: null,
  setStoreData: (data) => set((state) => ({ ...state, ...data })),
  addClasses: (newClasses) => set((state) => ({ classes: [...state.classes, ...newClasses] })),
  deleteClass: (id) => set((state) => ({ classes: state.classes.filter(c => c.id !== id) })),
  addStudent: (student) => set((state) => ({ students: [student, ...state.students] })),
  updateStudent: (id, data) => set((state) => ({
    students: state.students.map(s => s.id === id ? { ...s, ...data } : s)
  })),
  deleteStudent: (id) => set((state) => ({ students: state.students.filter(s => s.id !== id) })),
  addTeacher: (teacher) => set((state) => ({ teachers: [teacher, ...state.teachers] })),
  updateTeacher: (id, data) => set((state) => ({
    teachers: state.teachers.map(t => t.id === id ? { ...t, ...data } : t)
  })),
  deleteTeacher: (id) => set((state) => ({ teachers: state.teachers.filter(t => t.id !== id) })),
  updateSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),
  setSubjectLessons: (subjectLessons) => set(() => ({ subjectLessons })),
  setAssignments: (assignments) => set(() => ({ assignments })),
  setScheduleItems: (scheduleItems) => set(() => ({ scheduleItems })),
}));
