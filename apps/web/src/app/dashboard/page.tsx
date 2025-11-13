import { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import DeploymentsList from '@/components/DeploymentsList';
import RevenueChart from '@/components/RevenueChart';
import { DollarSign, Package, Users, Activity } from 'lucide-react';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your deployments.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value="$12,450"
            change="+12.5%"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
          />
          <StatsCard
            title="Products"
            value="24"
            change="+3"
            trend="up"
            icon={<Package className="w-6 h-6" />}
          />
          <StatsCard
            title="Customers"
            value="1,245"
            change="+8.2%"
            trend="up"
            icon={<Users className="w-6 h-6" />}
          />
          <StatsCard
            title="Active Deployments"
            value="6"
            change="-2"
            trend="down"
            icon={<Activity className="w-6 h-6" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueChart />
          </Suspense>
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Marketplace Distribution</h3>
            <div className="space-y-3">
              <MarketplaceBar name="Gumroad" percentage={45} color="bg-blue-500" />
              <MarketplaceBar name="Lemon Squeezy" percentage={35} color="bg-purple-500" />
              <MarketplaceBar name="Payhip" percentage={12} color="bg-green-500" />
              <MarketplaceBar name="Other" percentage={8} color="bg-gray-500" />
            </div>
          </div>
        </div>

        {/* Recent Deployments */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Recent Deployments</h3>
          </div>
          <Suspense fallback={<TableSkeleton />}>
            <DeploymentsList />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  );
}

function MarketplaceBar({
  name,
  percentage,
  color,
}: {
  name: string;
  percentage: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg border h-80 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="h-full bg-gray-100 rounded" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="p-6 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
      ))}
    </div>
  );
}
