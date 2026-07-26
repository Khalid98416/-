import { motion } from 'motion/react';
import { Lightbulb } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  description: string;
}

export function PlaceholderView({ title, description }: PlaceholderViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 h-full flex flex-col"
    >
      <div>
        <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
        <p className="text-slate-500 mt-2">{description}</p>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center mt-8 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl shadow-sm flex items-center justify-center mb-6">
          <Lightbulb className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">قريباً في مدرستي</h3>
        <p className="text-slate-500 max-w-md leading-relaxed">
          هذا القسم المخصص لـ <span className="font-bold text-blue-600">{title}</span> قيد التطوير. سيتم إضافته لاحقاً بناءً على الأولويات لتوفير أفضل تجربة إدارة مدرسية.
        </p>
      </div>
    </motion.div>
  );
}
