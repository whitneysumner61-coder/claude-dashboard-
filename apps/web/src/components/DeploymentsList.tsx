'use client';

import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function DeploymentsList() {
  const deployments = [
    {
      id: '1',
      product: 'Premium WordPress Theme',
      marketplace: 'Gumroad',
      status: 'DEPLOYED',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      product: 'SaaS Starter Kit',
      marketplace: 'Lemon Squeezy',
      status: 'DEPLOYING',
      timestamp: '30 minutes ago',
    },
    {
      id: '3',
      product: 'React Component Library',
      marketplace: 'Payhip',
      status: 'DEPLOYED',
      timestamp: '5 hours ago',
    },
    {
      id: '4',
      product: 'Vue.js Template',
      marketplace: 'Gumroad',
      status: 'FAILED',
      timestamp: '1 day ago',
    },
  ];

  return (
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
              Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {deployments.map((deployment) => (
            <tr key={deployment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{deployment.product}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {deployment.marketplace}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={deployment.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {deployment.timestamp}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    DEPLOYED: {
      color: 'bg-green-100 text-green-700',
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Deployed',
    },
    DEPLOYING: {
      color: 'bg-yellow-100 text-yellow-700',
      icon: <Clock className="w-4 h-4" />,
      label: 'Deploying',
    },
    FAILED: {
      color: 'bg-red-100 text-red-700',
      icon: <XCircle className="w-4 h-4" />,
      label: 'Failed',
    },
  };

  const { color, icon, label } = config[status as keyof typeof config] || config.DEPLOYED;

  return (
    <span
      className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${color}`}
    >
      {icon}
      {label}
    </span>
  );
}
