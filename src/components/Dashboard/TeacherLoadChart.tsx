import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TeacherLoadChartProps {
  data: { name: string; lessons: number }[];
}

export function TeacherLoadChart({ data }: TeacherLoadChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light flex flex-col h-[350px]">
      <h3 className="font-bold text-ink mb-6 font-cairo text-lg">أعلى المعلمين عبئاً (عدد الحصص)</h3>
      <div className="flex-1 min-h-0 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E6ED" />
            <XAxis 
              type="number" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-ink)', fontSize: 13, fontFamily: 'Tajawal' }} 
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-ink)', fontSize: 13, fontFamily: 'Tajawal' }} 
              width={80}
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
              dataKey="lessons" 
              fill="var(--color-growth-teal)" 
              radius={[0, 8, 8, 0]} 
              barSize={24} 
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
