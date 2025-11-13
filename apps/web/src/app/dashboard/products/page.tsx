import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your digital products and deployments</p>
          </div>
          <Link
            href="/dashboard/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            New Product
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            name="Premium WordPress Theme"
            price={49.99}
            sales={125}
            status="Published"
            image="/placeholder.png"
          />
          <ProductCard
            name="SaaS Starter Kit"
            price={199.99}
            sales={87}
            status="Published"
            image="/placeholder.png"
          />
          <ProductCard
            name="React Component Library"
            price={79.99}
            sales={54}
            status="Draft"
            image="/placeholder.png"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

function ProductCard({
  name,
  price,
  sales,
  status,
  image,
}: {
  name: string;
  price: number;
  sales: number;
  status: string;
}) {
  return (
    <div className="bg-white rounded-lg border hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg" />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              status === 'Published'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {status}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="font-semibold text-lg text-gray-900">${price}</span>
          <span>{sales} sales</span>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm font-medium">
            Deploy
          </button>
          <button className="flex-1 px-3 py-2 border rounded hover:bg-gray-50 text-sm font-medium">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
