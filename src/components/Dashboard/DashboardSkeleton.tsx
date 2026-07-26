export function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-6 w-full animate-pulse">
      {/* Top filter area skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 bg-slate-200 rounded-lg w-48 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-64"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-40"></div>
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
            <div className="w-16 h-16 bg-slate-200 rounded-xl flex-shrink-0"></div>
            <div className="flex flex-col w-full">
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 h-[400px] flex flex-col">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="flex-1 bg-slate-100 rounded-xl"></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 h-[400px] flex flex-col">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="flex-1 flex justify-center items-center">
             <div className="w-48 h-48 rounded-full border-[20px] border-slate-100"></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Chart skeleton */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 h-[350px] flex flex-col">
        <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
        <div className="flex-1 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  );
}
