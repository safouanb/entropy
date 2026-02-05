"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Shield,
  FileCheck,
  Scale,
  Lock,
  ClipboardCheck,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { IntroLoader } from "@/components/landing/IntroLoader";
import { ScrambleText } from "@/components/ui/scramble-text";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ParticleField } from "@/components/ui/particle-field";
import Beams from "@/components/Beams";
import ElectricBorder from "@/components/ElectricBorder";

const Dither = dynamic(() => import("@/components/Dither"), { ssr: false });

// ─── Fade-up animation wrapper ───────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function HomePage() {
  const [showLoader, setShowLoader] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const ditherOpacity = useTransform(scrollYProgress, [0, 0.6], [0.45, 0.15]);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <IntroLoader
        isVisible={showLoader}
        onComplete={() => setContentReady(true)}
      />

      <div className="min-h-screen bg-[#020616] text-white overflow-x-hidden relative">
        {/* ── Navigation (Handled by Global Header now) ── */}

        {/* ── Hero Section - Clean & Focused ── */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(38,99,255,0.78)_0%,rgba(29,78,216,0.5)_38%,rgba(2,6,23,0.96)_74%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.2)_0%,rgba(2,6,23,0.9)_60%,rgba(2,6,23,1)_100%)]" />

          {/* Single hero effect: Subtle dither */}
          <div className="absolute inset-0 opacity-40 mix-blend-screen">
            <Dither
              waveSpeed={0.02}
              waveFrequency={1.5}
              waveAmplitude={0.2}
              waveColor={[0.09, 0.27, 0.98]}
              colorNum={3}
              pixelSize={4}
              enableMouseInteraction={true}
              mouseRadius={0.4}
            />
          </div>

          {/* Clean content hierarchy */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!showLoader ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-white/60 mb-8">
                <Shield className="w-4 h-4 text-blue-300" />
                Decision authority for heat reuse
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-satoshi font-light tracking-tight mb-6 leading-[0.9]">
                We determine what is{" "}
                <span className="font-instrument italic text-blue-300">
                  defensible.
                </span>
              </h1>

              <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
                Before you engineer a heat reuse project, know whether it&apos;s compliant, financially viable, and who bears the risk.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!showLoader ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/assessment/new"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-satoshi font-medium rounded-xl hover:bg-blue-100 transition-colors duration-300"
              >
                Create Decision Record
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/20 text-white font-satoshi font-medium rounded-xl hover:border-white/30 hover:bg-white/5 transition-colors duration-300"
              >
                Learn More
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={!showLoader ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-sm text-white/30 mt-12 font-mono tracking-wider uppercase"
            >
              Compliance in minutes, not months
            </motion.p>
          </div>
        </section>

        {/* ── Decision Record Section ── */}
        <section className="relative py-32 px-6">
          {/* Subtle gradient separator */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="max-w-6xl mx-auto">
            <FadeUp>
              <div className="text-center mb-20">
                <span className="text-xs font-mono text-blue-300/70 tracking-[0.3em] uppercase mb-4 block">
                  Core artifact
                </span>
                <h2 className="text-4xl md:text-5xl mb-5">
                  <span className="font-satoshi font-light">The </span>
                  <span className="font-instrument italic text-white">
                    Decision Record
                  </span>
                </h2>
                <p className="text-white/35 text-lg max-w-2xl mx-auto font-satoshi font-light leading-relaxed">
                  A standardized, auditable artifact for heat reuse compliance
                  decisions. Not a feasibility study. Not a pitch deck. A
                  record.
                </p>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Scale,
                  title: "Scenarios",
                  description: "No Reuse, Direct Reuse, Reuse + Mitigation. Each with compliance outcome.",
                },
                {
                  icon: Shield,
                  title: "Risk Allocation",
                  description: "Who bears what risk. Critical for contracts and financing.",
                },
                {
                  icon: FileCheck,
                  title: "Compliance",
                  description: "COMPLIANT, CONDITIONAL, or NON-COMPLIANT. With regulatory citation.",
                },
                {
                  icon: Lock,
                  title: "Finalized",
                  description: "Lock your record. Create an audit trail. Stand behind your decision.",
                },
              ].map((item, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-white/20 transition-colors duration-300">
                    <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5 text-blue-300" />
                    </div>
                    <h3 className="text-lg font-satoshi font-medium mb-3 text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="relative py-32 px-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <div className="text-center mb-20">
                <span className="text-xs font-mono text-blue-300/70 tracking-[0.3em] uppercase mb-4 block">
                  How it works
                </span>
                <h2 className="text-4xl md:text-5xl mb-5">
                  <span className="font-satoshi font-light">From question to </span>
                  <span className="font-instrument italic text-white">
                    answer
                  </span>
                </h2>
                <p className="text-white/35 text-lg max-w-2xl mx-auto font-satoshi font-light leading-relaxed">
                  Go from &quot;can we reuse this heat?&quot; to a defensible,
                  auditable decision in three steps.
                </p>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: ClipboardCheck,
                  step: "01",
                  title: "Describe your project",
                  description:
                    "Enter your heat source, demand profile, and site constraints. No engineering required upfront.",
                },
                {
                  icon: BarChart3,
                  step: "02",
                  title: "Get scenario analysis",
                  description:
                    "Entropy evaluates three scenarios — no reuse, direct reuse, and reuse with mitigation — each with a compliance verdict.",
                },
                {
                  icon: CheckCircle,
                  step: "03",
                  title: "Receive your decision record",
                  description:
                    "A finalized, auditable artifact with compliance status, risk allocation, and regulatory citations you can share with stakeholders.",
                },
              ].map((item, i) => (
                <FadeUp key={i} delay={i * 0.12}>
                  <div className="glass-panel-hover p-8 rounded-2xl h-full group cursor-default">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors duration-500">
                        <item.icon className="w-5 h-5 text-blue-300/70 group-hover:text-blue-300 transition-colors duration-500" />
                      </div>
                      <span className="text-xs font-mono text-white/20 tracking-widest">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-satoshi font-medium mb-3 text-white/90">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/30 font-satoshi font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative py-32 px-6 text-center">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <FadeUp>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl mb-6">
                <span className="font-satoshi font-light">Ready to </span>
                <span className="font-instrument italic">begin?</span>
              </h2>
              <p className="text-white/35 mb-10 font-satoshi font-light text-lg">
                No signup required. See if your project is viable — for free.
              </p>
              <Link
                href="/assessment/new"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-satoshi font-semibold rounded-xl text-lg hover:bg-blue-300 transition-all duration-300 hover:shadow-glow hover:shadow-blue-400/30 hover:scale-105"
              >
                <ScrambleText
                  text="Create Decision Record"
                  autoStart={false}
                  scrambleSpeed={25}
                  scrambledLetterCount={4}
                />
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </FadeUp>
        </section>

        {/* ── Footer ── */}
        <footer className="relative py-14 px-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-instrument italic text-lg text-white/70 tracking-tight">
              Entropy
            </span>
            <p className="text-xs text-white/20 font-satoshi font-light tracking-wide">
              The decision authority for heat reuse compliance.
            </p>
            <p className="text-xs text-white/15 font-satoshi">
              &copy; 2026 Entropy
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
