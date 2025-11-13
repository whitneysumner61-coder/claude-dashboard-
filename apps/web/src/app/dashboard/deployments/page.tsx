import DashboardLayout from '@/components/DashboardLayout';
import { Rocket, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

export default function DeploymentsPage() {
  const deployments = [
    {
      id: '1',
      product: 'Premium WordPress Theme',
      marketplace: 'Gumroad',
      status: 'DEPLOYED',
      startedAt: '2024-01-15 10:30 AM',
      completedAt: '2024-01-15 10:32 AM',
      duration: '2m 15s',
    },
    {
      id: '2',
      product: 'SaaS Starter Kit',
      marketplace: 'Lemon Squeezy',
      status: 'DEPLOYING',
      startedAt: '2024-01-15 11:00 AM',
      completedAt: null,
      duration: '1m 30s',
    },
    {
      id: '3',
      product: 'React Component Library',
      marketplace: 'Gumroad',
      status: 'FAILED',
      startedAt: '2024-01-14 03:20 PM',
      completedAt: '2024-01-14 03:21 PM',
      duration: '1m 05s',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deployments</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage your product deployments across all marketplaces
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deployments</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Rocket className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">148</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">8</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">2</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Deployments Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Marketplace
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Started
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deployments.map((deployment) => (
                  <tr key={deployment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{deployment.product}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{deployment.marketplace}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DeploymentStatusBadge status={deployment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {deployment.startedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {deployment.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {deployment.status === 'FAILED' && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                          <RefreshCw className="w-4 h-4" />
                          Retry
                        </button>
                      )}
                      {deployment.status === 'DEPLOYED' && (
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DeploymentStatusBadge({ status }: { status: string }) {
  const config = {
    DEPLOYED: { color: 'bg-green-100 text-green-700', label: 'Deployed' },
    DEPLOYING: { color: 'bg-yellow-100 text-yellow-700', label: 'Deploying...' },
    FAILED: { color: 'bg-red-100 text-red-700', label: 'Failed' },
    PENDING: { color: 'bg-gray-100 text-gray-700', label: 'Pending' },
  };

  const { color, label } = config[status as keyof typeof config] || config.PENDING;

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {label}
    </span>
  );
}
