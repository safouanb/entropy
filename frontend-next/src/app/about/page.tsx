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
          <span className="font-instrument italic text-lg tracking-tight">Entropy</span>
          <div className="w-16" />
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl tracking-tight mb-6 leading-tight font-satoshi font-light">
            Every heat reuse project stalls in the{" "}
            <span className="font-instrument italic text-emerald-400">same place</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed font-satoshi font-light">
            Between &quot;this could work&quot; and &quot;we can prove it will.&quot;
            Entropy closes that gap.
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
            <h2 className="text-2xl font-satoshi font-light">The <span className="font-instrument italic">Problem</span></h2>
          </div>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              Data centers produce massive amounts of recoverable heat. Cities spend
              billions generating heat from gas and electricity. Connecting the two
              should be straightforward — the physics work.
            </p>
            <p>
              But every project hits the same wall: <span className="text-white font-medium">
              is it compliant? Is it financially viable? Who takes on the risk?</span> These
              questions kill projects before engineering even begins. Not because the answers
              don&apos;t exist, but because nobody owns the process of producing them.
            </p>
          </div>
        </section>

        {/* The Solution */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-satoshi font-light">What Entropy <span className="font-instrument italic">Does</span></h2>
          </div>
          <div className="text-gray-400 leading-relaxed space-y-4 mb-8">
            <p>
              Entropy takes the basic parameters of a heat reuse opportunity and
              produces a <span className="text-white font-medium">decision record</span> — a
              standardized, auditable document that tells you whether the project is
              compliant, under what conditions, and who bears what risk.
            </p>
            <p>
              You get a clear answer before committing engineering resources.
              Three scenarios evaluated, regulatory citations included, risk
              allocation made explicit. Something you can hand to a regulator,
              an investor, or a project partner.
            </p>
          </div>

          {/* Quote */}
          <div className="border-l-2 border-emerald-500 pl-6 py-4 bg-white/5 rounded-r-lg">
            <p className="text-lg text-white font-instrument italic">
              &quot;Know whether it&apos;s worth building — before you start building.&quot;
            </p>
          </div>
        </section>

        {/* Who It's For */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-satoshi font-light">Who it&apos;s <span className="font-instrument italic">for</span></h2>
          </div>

          <div className="space-y-3">
            {[
              {
                name: "Data center operators",
                desc: "Evaluate whether your waste heat has reuse potential before engaging consultants or engineers.",
              },
              {
                name: "District heating companies",
                desc: "Quickly assess new heat sources for regulatory compliance and integration feasibility.",
              },
              {
                name: "Municipal energy planners",
                desc: "Get standardized decision records to support policy compliance and funding applications.",
              },
              {
                name: "Infrastructure investors",
                desc: "Due-diligence heat reuse opportunities with auditable compliance and risk documentation.",
              },
            ].map((audience, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-white/10 bg-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{audience.name}</div>
                    <div className="text-sm text-gray-400">{audience.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Entropy */}
        <section>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Fast", desc: "Get a compliance verdict in minutes. No need to commission a feasibility study before knowing if a project is worth pursuing." },
              { title: "Auditable", desc: "Every decision record includes regulatory citations, scenario breakdowns, and explicit risk allocation. Built for scrutiny." },
              { title: "Independent", desc: "Entropy has no stake in whether you build. You get an honest assessment, not a sales pitch from a contractor." },
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
          <p className="text-gray-400 mb-6 font-satoshi font-light">Ready to see it in action?</p>
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
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500 font-satoshi font-light">
          <span className="font-instrument italic">Entropy</span> © 2026
        </div>
      </footer>
    </div>
  );
}
