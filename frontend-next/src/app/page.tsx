import Link from 'next/link';
import { ArrowRight, Shield, FileCheck, Scale, Lock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl tracking-tight">ENTROPY</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/assessment/new" className="text-sm text-gray-400 hover:text-white transition">
              New Record
            </Link>
            <Link
              href="/assessment/new"
              className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-sm text-gray-400 mb-8">
            <Shield className="w-4 h-4" />
            The decision authority for heat reuse
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            We determine what is
            <span className="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              defensible.
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Not what must be built. Entropy is the accountable decision layer between
            policy intent and infrastructure execution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment/new"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition group"
            >
              Create Decision Record
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition"
            >
              Learn More
            </Link>
          </div>

          <p className="text-sm text-gray-600 mt-8 font-mono">
            This is not a pitch. This is the product.
          </p>
        </div>
      </section>

      {/* What is a Decision Record */}
      <section className="py-32 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">The Decision Record</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A standardized, auditable artifact for heat reuse compliance decisions.
              Not a feasibility study. Not a pitch deck. A record.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Scale,
                title: 'Scenarios',
                subtitle: 'A / B / C',
                description: 'No Reuse, Direct Reuse, Reuse + Mitigation. Each with compliance outcome.',
              },
              {
                icon: Shield,
                title: 'Risk Allocation',
                subtitle: 'Explicit',
                description: 'Who bears what risk. Critical for contracts and financing.',
              },
              {
                icon: FileCheck,
                title: 'Compliance',
                subtitle: 'Definitive',
                description: 'COMPLIANT, CONDITIONAL, or NON-COMPLIANT. With regulatory citation.',
              },
              {
                icon: Lock,
                title: 'Finalized',
                subtitle: 'Immutable',
                description: 'Lock your record. Create an audit trail. Stand behind your decision.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group"
              >
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition">
                  <item.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-xs text-emerald-400 font-mono mb-1">{item.subtitle}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 4 Layers */}
      <section className="py-32 px-6 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">Where We Sit</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            There are 4 layers in infrastructure delivery. We're not integrators.
            We're not optional analytics. We're the decision authority.
          </p>

          <div className="space-y-4">
            {[
              { level: '1', name: 'Execution', desc: 'Installing assets, running projects. Commoditized.', opacity: 'opacity-30' },
              { level: '2', name: 'Enablement', desc: 'Tools and analytics. Nice, but optional.', opacity: 'opacity-40' },
              { level: '3', name: 'Decision Authority', desc: 'What is viable. What is compliant. Who bears risk.', opacity: 'opacity-100', highlight: true },
              { level: '4', name: 'Standard', desc: 'Required. Embedded. The dream.', opacity: 'opacity-60' },
            ].map((layer, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl border transition ${layer.highlight
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : `border-white/10 bg-white/5 ${layer.opacity}`
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold ${layer.highlight ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'
                    }`}>
                    {layer.level}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{layer.name}</div>
                    <div className="text-sm text-gray-400">{layer.desc}</div>
                  </div>
                  {layer.highlight && (
                    <div className="ml-auto text-sm font-mono text-emerald-400">
                      ← ENTROPY
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to create your first record?
          </h2>
          <p className="text-gray-400 mb-8">
            No signup required. Generate a decision record in minutes.
          </p>
          <Link
            href="/assessment/new"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-black font-semibold rounded-lg text-lg hover:bg-gray-100 transition group"
          >
            Create Decision Record
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-sm">E</span>
            </div>
            <span className="font-bold tracking-tight">ENTROPY</span>
          </div>
          <p className="text-sm text-gray-500 font-mono">
            The decision authority for heat reuse compliance.
          </p>
          <p className="text-sm text-gray-600">
            © 2026 Entropy
          </p>
        </div>
      </footer>
    </div>
  );
}
