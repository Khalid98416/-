import { ElementType } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  colorClass: string;
}

export function StatCard({ title, value, icon: Icon, colorClass }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border-light flex items-start gap-4">
      <div className={`p-4 rounded-xl ${colorClass} text-white bg-opacity-90 flex-shrink-0`}>
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col">
        <h3 className="text-ink text-sm font-medium font-sans">{title}</h3>
        <span className="text-3xl font-bold font-cairo text-ink mt-1 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString('en-US') : value}
        </span>
      </div>
    </div>
  );
}
