import { useState } from 'react';
import { useSchoolStore } from '../store';
import { Building2, Palette, Save, Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'motion/react';

const fonts = [
  { id: 'Cairo', name: 'Cairo' },
  { id: 'Tajawal', name: 'Tajawal' },
  { id: 'Almarai', name: 'Almarai' },
  { id: 'Readex Pro', name: 'Readex Pro' },
  { id: 'system-ui', name: 'System UI (افتراضي)' }
];

export function Settings() {
  const { settings, updateSettings } = useSchoolStore();
  const [activeTab, setActiveTab] = useState<'general' | 'appearance'>('general');
  const [formData, setFormData] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-8 h-full flex flex-col w-full overflow-y-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-cairo text-slate-800">الإعدادات</h1>
          <p className="text-slate-500 mt-1 font-sans text-sm">تخصيص إعدادات النظام والمظهر</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold font-sans flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Save className="w-5 h-5" />
          {isSaved ? 'تم الحفظ!' : 'حفظ التغييرات'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors cursor-pointer ${activeTab === 'general' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Building2 className={`w-5 h-5 ${activeTab === 'general' ? 'text-blue-600' : 'text-slate-400'}`} />
              إعدادات عامة
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors cursor-pointer ${activeTab === 'appearance' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Palette className={`w-5 h-5 ${activeTab === 'appearance' ? 'text-blue-600' : 'text-slate-400'}`} />
              الشكل والمظهر
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 min-h-[400px]">
            {activeTab === 'general' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
              >
                <h2 className="text-xl font-bold text-slate-800 mb-6">المعلومات الأساسية</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">اسم المدرسة</label>
                    <input 
                      type="text" 
                      value={formData.schoolName}
                      onChange={e => setFormData({...formData, schoolName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                      placeholder="أدخل اسم المدرسة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">اسم المدير</label>
                    <input 
                      type="text" 
                      value={formData.principalName}
                      onChange={e => setFormData({...formData, principalName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                      placeholder="أدخل اسم مدير المدرسة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">العام الدراسي</label>
                    <input 
                      type="text" 
                      value={formData.academicYear}
                      onChange={e => setFormData({...formData, academicYear: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                      placeholder="مثال: 2024-2025"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl"
              >
                <h2 className="text-xl font-bold text-slate-800 mb-6">أوضاع العرض</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  <button
                    onClick={() => setFormData({...formData, theme: 'light'})}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-colors cursor-pointer ${formData.theme === 'light' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'}`}
                  >
                    <Sun className="w-8 h-8" />
                    <span className="font-bold">فاتح</span>
                  </button>
                  <button
                    onClick={() => setFormData({...formData, theme: 'dark'})}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-colors cursor-pointer ${formData.theme === 'dark' ? 'border-blue-500 bg-slate-800 text-white' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'}`}
                  >
                    <Moon className="w-8 h-8" />
                    <span className="font-bold">داكن</span>
                  </button>
                  <button
                    onClick={() => setFormData({...formData, theme: 'auto'})}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-colors cursor-pointer ${formData.theme === 'auto' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'}`}
                  >
                    <Monitor className="w-8 h-8" />
                    <span className="font-bold">تلقائي</span>
                  </button>
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-6">الخطوط</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fonts.map(font => (
                    <button
                      key={font.id}
                      onClick={() => setFormData({...formData, font: font.id})}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors cursor-pointer ${formData.font === font.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'}`}
                      style={{ fontFamily: font.id !== 'system-ui' ? `'${font.id}', sans-serif` : 'system-ui' }}
                    >
                      <span className="font-bold text-lg">{font.name}</span>
                      <span className="text-sm opacity-70">أبجد هوز</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
