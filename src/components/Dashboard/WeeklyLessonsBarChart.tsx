import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyLessonsBarChartProps {
  data: { name: string; count: number }[];
}

export function WeeklyLessonsBarChart({ data }: WeeklyLessonsBarChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light flex flex-col h-[400px]">
      <h3 className="font-bold text-ink mb-6 font-cairo text-lg">توزيع الحصص على أيام الأسبوع</h3>
      <div className="flex-1 min-h-0 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-academic-indigo)" />
                <stop offset="100%" stopColor="var(--color-merit-gold)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E6ED" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-ink)', fontSize: 13, fontFamily: 'Tajawal' }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-ink)', fontSize: 13, fontFamily: 'Tajawal' }} 
              width={40} 
            />
            <Tooltip
              cursor={{ fill: '#F5F7FA' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid var(--color-border-light)', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontFamily: 'Tajawal',
                direction: 'rtl'
              }}
              formatter={(value: number) => [<span className="font-cairo font-bold">{value} حصة</span>, '']}
            />
            <Bar 
              dataKey="count" 
              fill="url(#barGradient)" 
              radius={[8, 8, 0, 0]} 
              barSize={48} 
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
