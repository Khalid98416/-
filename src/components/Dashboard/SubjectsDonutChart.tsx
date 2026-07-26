import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SubjectsDonutChartProps {
  data: { name: string; value: number }[];
  totalLessons: number;
}

const COLORS = [
  'var(--color-academic-indigo)', 
  'var(--color-merit-gold)', 
  'var(--color-growth-teal)', 
  'var(--color-signal-coral)', 
  '#475569', 
  '#8B5CF6'
];

export function SubjectsDonutChart({ data, totalLessons }: SubjectsDonutChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light flex flex-col h-[400px]">
      <h3 className="font-bold text-ink mb-2 font-cairo text-lg">توزيع الحصص حسب المادة</h3>
      <div className="flex-1 min-h-0 w-full relative" dir="ltr">
        <div className="absolute inset-0 flex items-center justify-center flex-col z-0 pointer-events-none mb-4">
          <span className="text-4xl font-black text-ink font-cairo">{totalLessons}</span>
          <span className="text-sm text-slate-500 font-sans font-medium mt-1">إجمالي الحصص</span>
        </div>
        <ResponsiveContainer width="100%" height="100%" className="z-10">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid var(--color-border-light)', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontFamily: 'Tajawal',
                direction: 'rtl'
              }}
              formatter={(value: number, name: string) => [
                <span className="font-cairo font-bold">{value} حصة ({(value / totalLessons * 100).toFixed(1)}%)</span>, 
                name
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value) => <span className="text-ink font-sans mr-2">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
