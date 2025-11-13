'use client';

export default function RevenueChart() {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
      <div className="h-64 flex items-end justify-between gap-2">
        {[
          { label: 'Mon', value: 65 },
          { label: 'Tue', value: 78 },
          { label: 'Wed', value: 45 },
          { label: 'Thu', value: 89 },
          { label: 'Fri', value: 92 },
          { label: 'Sat', value: 56 },
          { label: 'Sun', value: 70 },
        ].map((day) => (
          <div key={day.label} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors" style={{ height: `${day.value}%` }} />
            <span className="text-xs text-gray-600">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
