"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  SparklesIcon,
  ScaleIcon,
  CpuChipIcon,
  BuildingLibraryIcon,
  GlobeEuropeAfricaIcon
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto px-4">
      {/* Header / Manifesto Start */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          The Gap Between <span className="text-emerald-500">Interest</span> and <span className="text-emerald-500">Feasibility</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Entropy exists because one of the largest energy inefficiencies in modern society has quietly been normalized.
        </p>
      </div>

      <div className="space-y-16">
        {/* The Problem */}
        <section className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">The Absurdity of Normalized Waste</h2>
          <p className="text-gray-600 leading-7">
            Data centers generate enormous amounts of low- to mid-grade heat as a byproduct of computation, and that heat is almost always discarded into the air or water. At the same time, cities, residential buildings, campuses, and industrial facilities spend billions each year producing heat through gas, electricity, or centralized district heating systems.
          </p>
          <p className="text-gray-600 leading-7 mt-4">
            The absurdity is not technological; the physics are well understood. The absurdity is organizational, informational, and economic. Every potential heat reuse project helps, yet most die in the same place: the gap between interest and feasibility. That gap is filled today by slow, bespoke engineering studies, consultants, and spreadsheets.
          </p>
        </section>

        {/* The Solution */}
        <section className="grid gap-8 md:grid-cols-2 items-center bg-slate-50 p-8 rounded-2xl border border-slate-100">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Entropy is the Intelligence Layer</h2>
            <p className="text-gray-600 leading-7 mb-6">
              Entropy is a software platform that turns waste heat reuse from an expert-driven, manual, and opaque process into a computable, standardized, and repeatable decision.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CpuChipIcon className="h-6 w-6 text-emerald-500 shrink-0" />
                <span className="text-sm text-gray-700">Turns opaque engineering studies into instant feasibility scores.</span>
              </li>
              <li className="flex items-start gap-3">
                <ScaleIcon className="h-6 w-6 text-emerald-500 shrink-0" />
                <span className="text-sm text-gray-700">Aligns incentives between data centers and municipalities.</span>
              </li>
              <li className="flex items-start gap-3">
                <GlobeEuropeAfricaIcon className="h-6 w-6 text-emerald-500 shrink-0" />
                <span className="text-sm text-gray-700">Makes waste heat visible, legible, and actionable.</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col justify-center">
            <blockquote className="text-lg italic text-slate-700 mb-4 border-l-4 border-emerald-500 pl-4">
              "The product does not replace engineering; it precedes it. It determines whether engineering is worth doing at all."
            </blockquote>
            <p className="text-sm text-slate-500 font-medium">— The Entropy Thesis</p>
          </div>
        </section>

        {/* The Analogy */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-100">
              <BuildingLibraryIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">The Airbnb for Waste Heat</h2>
          </div>
          <p className="text-gray-600 leading-7">
            Airbnb did not create new housing stock; it made unused capacity legible, comparable, and accessible. It abstracted away the complexity of zoning, trust, and pricing. Entropy applies the same logic to waste heat. It does not generate heat or consume it. It makes heat visible as a resource, evaluates its viability, and connects it to demand.
          </p>
        </section>

        {/* The Vision */}
        <section className="grid gap-6 md:grid-cols-3">
          <VisionCard
            title="Software First"
            description="We are not a hardware or construction business. We are an intelligence business. Our defensibility lies in data models and feasibility logic."
          />
          <VisionCard
            title="Pragmatism"
            description="We are not driven by symbolism alone. Projects move forward not because they are theoretically elegant, but because they make financial sense."
          />
          <VisionCard
            title="Invisible System"
            description="Entropy's ambition is to become invisible: the default system people use to understand waste heat. When feasibility is no longer a bottleneck, reuse becomes the norm."
          />
        </section>

        <div className="text-center pt-8 border-t border-gray-100">
          <p className="text-lg font-medium text-gray-900 mb-2">Turning Waste into Opportunity</p>
          <p className="text-slate-500">
            By introducing computation where intuition and bureaucracy once dominated.
          </p>
        </div>
      </div>
    </div>
  );
}

function VisionCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-white border-slate-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <SparklesIcon className="h-5 w-5 text-emerald-500" />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
