import Link from 'next/link';
import { ArrowRight, Rocket, Zap, Shield, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">AutoDeploy Pro</div>
          <nav className="flex gap-6">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Deploy to Every Marketplace
            <span className="text-blue-600"> Automatically</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AutoDeploy Pro automatically deploys your digital products to Gumroad,
            Lemon Squeezy, and 10+ marketplaces with zero manual intervention.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-lg font-semibold"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 text-lg font-semibold"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Everything You Need to Sell Everywhere
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Rocket className="w-8 h-8 text-blue-600" />}
            title="One-Click Deployment"
            description="Deploy to multiple marketplaces simultaneously with a single click"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-blue-600" />}
            title="Real-Time Monitoring"
            description="Track deployment status, sales, and performance in real-time"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-blue-600" />}
            title="License Management"
            description="Cryptographic license keys with hardware binding and auto-validation"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
            title="Smart Pricing"
            description="AI-powered dynamic pricing based on competitor analysis"
          />
        </div>
      </section>

      {/* Supported Marketplaces */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Supported Marketplaces
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 items-center justify-items-center">
          {[
            'Gumroad',
            'Lemon Squeezy',
            'Etsy',
            'Shopify',
            'Payhip',
            'SendOwl',
            'Podia',
            'Teachable',
          ].map((marketplace) => (
            <div
              key={marketplace}
              className="px-6 py-4 bg-white rounded-lg border-2 border-gray-200 font-semibold text-gray-700 hover:border-blue-400 transition-colors"
            >
              {marketplace}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Automate Your Deployments?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of creators who save 10+ hours per week with AutoDeploy Pro
          </p>
          <Link
            href="/register"
            className="inline-flex px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 items-center gap-2 text-lg font-semibold"
          >
            Start Your Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600">
          <p>&copy; 2024 AutoDeploy Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
