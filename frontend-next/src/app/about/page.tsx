"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Zap, Target, Brain } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span className="font-bold">ABOUT ENTROPY</span>
          <div className="w-16" />
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            The Gap Between <span className="text-emerald-400">Interest</span> and{" "}
            <span className="text-emerald-400">Feasibility</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Entropy exists because one of the largest energy inefficiencies in modern
            society has quietly been normalized.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">
        {/* The Problem */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold">The Absurdity of Normalized Waste</h2>
          </div>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              Data centers generate enormous amounts of low- to mid-grade heat as a byproduct
              of computation, and that heat is almost always discarded into the air or water.
              At the same time, cities spend billions each year producing heat through gas
              and electricity.
            </p>
            <p>
              The absurdity is not technological — the physics are well understood. The absurdity
              is organizational, informational, and economic. Every potential heat reuse project
              dies in the same place: <span className="text-white font-medium">the gap between
                interest and feasibility</span>.
            </p>
          </div>
        </section>

        {/* The Solution */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold">We Are The Decision Authority</h2>
          </div>
          <div className="text-gray-400 leading-relaxed space-y-4 mb-8">
            <p>
              Entropy is not a dashboard. Not a marketplace. Not an analytics tool you can
              optionally use. We are the <span className="text-white font-medium">accountable
                decision layer</span> between policy intent and infrastructure execution.
            </p>
            <p>
              We determine what is defensible, not what must be built. The product does not
              replace engineering — it precedes it. It determines whether engineering is
              worth doing at all.
            </p>
          </div>

          {/* Quote */}
          <div className="border-l-2 border-emerald-500 pl-6 py-4 bg-white/5 rounded-r-lg">
            <p className="text-lg text-white italic">
              "We don't just model scenarios — we stand behind one."
            </p>
          </div>
        </section>

        {/* The Four Layers */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold">Where We Sit</h2>
          </div>

          <div className="space-y-3">
            {[
              { level: "1", name: "Execution", desc: "Installing assets, running projects", opacity: "opacity-40" },
              { level: "2", name: "Enablement", desc: "Tools and analytics — nice, but optional", opacity: "opacity-50" },
              { level: "3", name: "Decision Authority", desc: "What is viable. What is compliant. Who bears risk.", highlight: true },
              { level: "4", name: "Standard", desc: "Required. Embedded. The dream.", opacity: "opacity-70" },
            ].map((layer, i) => (
              <div
                key={i}
                className={`p-5 rounded-xl border transition ${layer.highlight
                    ? "border-emerald-500 bg-emerald-500/10"
                    : `border-white/10 bg-white/5 ${layer.opacity}`
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold ${layer.highlight ? "bg-emerald-500 text-black" : "bg-white/10 text-white"
                      }`}
                  >
                    {layer.level}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{layer.name}</div>
                    <div className="text-sm text-gray-400">{layer.desc}</div>
                  </div>
                  {layer.highlight && (
                    <div className="text-sm font-mono text-emerald-400">← ENTROPY</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision Cards */}
        <section>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Software First", desc: "We are an intelligence business. Our defensibility lies in data models and feasibility logic." },
              { title: "Pragmatism", desc: "Projects move forward not because they are elegant, but because they make financial sense." },
              { title: "Invisible System", desc: "The ambition is to become the default. When feasibility is no longer a bottleneck, reuse becomes the norm." },
            ].map((card, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/10 bg-white/5">
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 border-t border-white/10">
          <p className="text-gray-400 mb-6">Ready to see it in action?</p>
          <Link
            href="/assessment/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition group"
          >
            Create Your First Decision Record
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          Entropy © 2026 — The decision authority for heat reuse compliance.
        </div>
      </footer>
    </div>
  );
}
