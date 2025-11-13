import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

export default function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {change}
        </div>
      </div>
    </div>
  );
}
