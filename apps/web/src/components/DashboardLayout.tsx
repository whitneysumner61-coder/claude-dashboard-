import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Rocket,
  Users,
  Key,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">AutoDeploy Pro</h2>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavLink href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />}>
            Dashboard
          </NavLink>
          <NavLink href="/dashboard/products" icon={<Package className="w-5 h-5" />}>
            Products
          </NavLink>
          <NavLink href="/dashboard/deployments" icon={<Rocket className="w-5 h-5" />}>
            Deployments
          </NavLink>
          <NavLink href="/dashboard/customers" icon={<Users className="w-5 h-5" />}>
            Customers
          </NavLink>
          <NavLink href="/dashboard/licenses" icon={<Key className="w-5 h-5" />}>
            Licenses
          </NavLink>
          <NavLink href="/dashboard/analytics" icon={<BarChart3 className="w-5 h-5" />}>
            Analytics
          </NavLink>
          <NavLink href="/dashboard/settings" icon={<Settings className="w-5 h-5" />}>
            Settings
          </NavLink>
        </nav>
        <div className="p-4 border-t">
          <button className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  // In a real app, use usePathname() from next/navigation
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}
