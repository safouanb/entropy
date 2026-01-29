"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, FileCheck, Scale, Lock } from "lucide-react";
import dynamic from "next/dynamic";
import { IntroLoader } from "@/components/landing/IntroLoader";

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
    const timer = setTimeout(() => setShowLoader(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <IntroLoader
        isVisible={showLoader}
        onComplete={() => setContentReady(true)}
      />

      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        {/* ── Navigation ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center group-hover:shadow-glow-sm transition-shadow duration-500">
                <span className="text-black text-xl font-instrument">E</span>
              </div>
              <span className="font-satoshi font-bold text-lg tracking-tight">
                ENTROPY
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/about"
                className="text-sm text-white/50 hover:text-white transition-colors duration-300 font-satoshi"
              >
                About
              </Link>
              <Link
                href="/assessment/new"
                className="text-sm text-white/50 hover:text-white transition-colors duration-300 font-satoshi"
              >
                New Record
              </Link>
              <Link
                href="/assessment/new"
                className="px-5 py-2.5 bg-white text-black text-sm font-satoshi font-medium rounded-lg hover:bg-emerald-300 hover:text-black transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero with Dither ── */}
        <motion.section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center pt-20 px-6"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          {/* Dither Background */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{ opacity: ditherOpacity }}
          >
            <Dither
              waveSpeed={0.03}
              waveFrequency={2}
              waveAmplitude={0.3}
              waveColor={[0.05, 0.45, 0.3]}
              colorNum={4}
              pixelSize={3}
              enableMouseInteraction={true}
              mouseRadius={0.6}
            />
          </motion.div>

          {/* Dark vignette overlay */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
            }}
          />

          {/* Hero Content */}
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!showLoader ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-button text-sm text-white/70 mb-10 font-satoshi tracking-wide"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              The decision authority for heat reuse
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={!showLoader ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl sm:text-6xl md:text-8xl tracking-tight mb-8 leading-[0.95]"
            >
              <span className="font-satoshi font-light text-white/90">
                We determine
              </span>
              <br />
              <span className="font-satoshi font-light text-white/90">
                what is{" "}
              </span>
              <span className="font-instrument italic bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                defensible.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={!showLoader ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-14 leading-relaxed font-satoshi font-light"
            >
              Not what must be built. Entropy is the accountable decision layer
              between policy intent and infrastructure execution.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!showLoader ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/assessment/new"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-satoshi font-semibold rounded-xl hover:bg-emerald-300 transition-all duration-300 hover:shadow-glow"
              >
                Create Decision Record
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 glass-button text-white font-satoshi font-medium rounded-xl"
              >
                Learn More
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={!showLoader ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-xs text-white/20 mt-12 font-mono tracking-widest uppercase"
            >
              This is not a pitch. This is the product.
            </motion.p>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={!showLoader ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] text-white/20 font-satoshi tracking-[0.3em] uppercase">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent"
            />
          </motion.div>
        </motion.section>

        {/* ── Decision Record Section ── */}
        <section className="relative py-32 px-6">
          {/* Subtle gradient separator */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="max-w-6xl mx-auto">
            <FadeUp>
              <div className="text-center mb-20">
                <span className="text-xs font-mono text-emerald-400/70 tracking-[0.3em] uppercase mb-4 block">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: Scale,
                  title: "Scenarios",
                  subtitle: "A / B / C",
                  description:
                    "No Reuse, Direct Reuse, Reuse + Mitigation. Each with compliance outcome.",
                },
                {
                  icon: Shield,
                  title: "Risk Allocation",
                  subtitle: "Explicit",
                  description:
                    "Who bears what risk. Critical for contracts and financing.",
                },
                {
                  icon: FileCheck,
                  title: "Compliance",
                  subtitle: "Definitive",
                  description:
                    "COMPLIANT, CONDITIONAL, or NON-COMPLIANT. With regulatory citation.",
                },
                {
                  icon: Lock,
                  title: "Finalized",
                  subtitle: "Immutable",
                  description:
                    "Lock your record. Create an audit trail. Stand behind your decision.",
                },
              ].map((item, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="glass-panel-hover p-7 rounded-2xl h-full group cursor-default">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:bg-emerald-500/10 transition-colors duration-500">
                      <item.icon className="w-5 h-5 text-emerald-400/70 group-hover:text-emerald-400 transition-colors duration-500" />
                    </div>
                    <div className="text-[10px] text-emerald-400/50 font-mono tracking-[0.2em] uppercase mb-2">
                      {item.subtitle}
                    </div>
                    <h3 className="text-lg font-satoshi font-medium mb-2 text-white/90">
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

        {/* ── Where We Sit ── */}
        <section className="relative py-32 px-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div className="text-center mb-16">
                <span className="text-xs font-mono text-emerald-400/70 tracking-[0.3em] uppercase mb-4 block">
                  Positioning
                </span>
                <h2 className="text-4xl md:text-5xl mb-5">
                  <span className="font-satoshi font-light">Where we </span>
                  <span className="font-instrument italic text-white">
                    sit
                  </span>
                </h2>
                <p className="text-white/35 text-lg max-w-2xl mx-auto font-satoshi font-light leading-relaxed">
                  There are 4 layers in infrastructure delivery. We&apos;re not
                  integrators. We&apos;re not optional analytics. We&apos;re the
                  decision authority.
                </p>
              </div>
            </FadeUp>

            <div className="space-y-3">
              {[
                {
                  level: "1",
                  name: "Execution",
                  desc: "Installing assets, running projects. Commoditized.",
                  dimmed: true,
                },
                {
                  level: "2",
                  name: "Enablement",
                  desc: "Tools and analytics. Nice, but optional.",
                  dimmed: true,
                },
                {
                  level: "3",
                  name: "Decision Authority",
                  desc: "What is viable. What is compliant. Who bears risk.",
                  highlight: true,
                },
                {
                  level: "4",
                  name: "Standard",
                  desc: "Required. Embedded. The dream.",
                  dimmed: true,
                  faded: true,
                },
              ].map((layer, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <div
                    className={`p-6 rounded-2xl transition-all duration-500 ${
                      layer.highlight
                        ? "glass-panel border-emerald-500/30 bg-emerald-500/5"
                        : `glass-panel ${layer.dimmed ? "opacity-40" : ""} ${
                            layer.faded ? "opacity-25" : ""
                          }`
                    }`}
                    style={
                      layer.highlight
                        ? {
                            borderColor: "rgba(16, 185, 129, 0.2)",
                            boxShadow:
                              "0 0 60px -15px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(16, 185, 129, 0.1)",
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                          layer.highlight
                            ? "bg-emerald-500 text-black"
                            : "bg-white/5 text-white/50"
                        }`}
                      >
                        {layer.level}
                      </div>
                      <div>
                        <div className="font-satoshi font-medium text-lg">
                          {layer.name}
                        </div>
                        <div className="text-sm text-white/35 font-satoshi font-light">
                          {layer.desc}
                        </div>
                      </div>
                      {layer.highlight && (
                        <div className="ml-auto text-xs font-mono text-emerald-400/70 tracking-[0.15em]">
                          ENTROPY
                        </div>
                      )}
                    </div>
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
                No signup required. Generate a decision record in minutes.
              </p>
              <Link
                href="/assessment/new"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-satoshi font-semibold rounded-xl text-lg hover:bg-emerald-300 transition-all duration-300 hover:shadow-glow"
              >
                Create Decision Record
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </FadeUp>
        </section>

        {/* ── Footer ── */}
        <footer className="relative py-14 px-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
                <span className="text-black text-sm font-instrument">E</span>
              </div>
              <span className="font-satoshi font-bold tracking-tight text-sm">
                ENTROPY
              </span>
            </div>
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
