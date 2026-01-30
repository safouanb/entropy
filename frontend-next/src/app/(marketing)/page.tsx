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
import { MagneticCursor, GlobalCursor } from "@/components/ui/magnetic-cursor";
import { ParticleField } from "@/components/ui/particle-field";

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
      <GlobalCursor />
      <IntroLoader
        isVisible={showLoader}
        onComplete={() => setContentReady(true)}
      />

      <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
        {/* Particle field background */}
        <ParticleField
          count={60}
          color="#10b981"
          size={1.5}
          speed={0.3}
          className="opacity-20"
        />
        {/* ── Navigation (Handled by Global Header now) ── */}

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
          <div className="relative z-10 max-w-5xl mx-auto text-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!showLoader ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-button text-sm text-white/70 mb-10 font-satoshi tracking-wide pointer-events-auto"
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
                <ScrambleText
                  text="We determine"
                  autoStart={!showLoader}
                  delay={800}
                  scrambleSpeed={70}
                  scrambledLetterCount={5}
                />
              </span>
              <br />
              <span className="font-satoshi font-light text-white/90">
                <ScrambleText
                  text="what is "
                  autoStart={!showLoader}
                  delay={1200}
                  scrambleSpeed={60}
                  scrambledLetterCount={3}
                />
              </span>
              <span className="font-instrument italic bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                <ScrambleText
                  text="defensible."
                  autoStart={!showLoader}
                  delay={1600}
                  scrambleSpeed={50}
                  scrambledLetterCount={4}
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ[]{}()#@!%&*"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={!showLoader ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-14 leading-relaxed font-satoshi font-light"
            >
              Before you engineer a heat reuse project, know whether
              it&apos;s compliant, financially viable, and who bears the risk.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!showLoader ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto"
            >
              <MagneticCursor strength={0.2} size={60}>
                <Link
                  href="/assessment/new"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-satoshi font-semibold rounded-xl hover:bg-emerald-300 transition-all duration-300 hover:shadow-glow hover:shadow-emerald-400/20"
                >
                  <ScrambleText
                    text="Create Decision Record"
                    autoStart={false}
                    scrambleSpeed={30}
                    scrambledLetterCount={3}
                  />
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </MagneticCursor>
              <MagneticCursor strength={0.15} size={50}>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 glass-button text-white font-satoshi font-medium rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Learn More
                </Link>
              </MagneticCursor>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={!showLoader ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-xs text-white/20 mt-12 font-mono tracking-widest uppercase"
            >
              Compliance in minutes, not months.
            </motion.p>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={!showLoader ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
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
                  spotlightColor: "rgba(168, 85, 247, 0.15)",
                },
                {
                  icon: Shield,
                  title: "Risk Allocation",
                  subtitle: "Explicit",
                  description:
                    "Who bears what risk. Critical for contracts and financing.",
                  spotlightColor: "rgba(16, 185, 129, 0.15)",
                },
                {
                  icon: FileCheck,
                  title: "Compliance",
                  subtitle: "Definitive",
                  description:
                    "COMPLIANT, CONDITIONAL, or NON-COMPLIANT. With regulatory citation.",
                  spotlightColor: "rgba(59, 130, 246, 0.15)",
                },
                {
                  icon: Lock,
                  title: "Finalized",
                  subtitle: "Immutable",
                  description:
                    "Lock your record. Create an audit trail. Stand behind your decision.",
                  spotlightColor: "rgba(251, 191, 36, 0.15)",
                },
              ].map((item, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <SpotlightCard
                    spotlightColor={item.spotlightColor}
                    className="p-7 h-full group cursor-default bg-black/20 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-500"
                  >
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:bg-white/10 transition-all duration-500"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon className="w-5 h-5 text-emerald-400/70 group-hover:text-emerald-400 transition-colors duration-500" />
                    </motion.div>
                    <div className="text-[10px] text-emerald-400/50 font-mono tracking-[0.2em] uppercase mb-2">
                      <ScrambleText
                        text={item.subtitle}
                        autoStart={false}
                        scrambleSpeed={40}
                        scrambledLetterCount={2}
                      />
                    </div>
                    <motion.h3
                      className="text-lg font-satoshi font-medium mb-2 text-white/90"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.title}
                    </motion.h3>
                    <p className="text-sm text-white/30 font-satoshi font-light leading-relaxed group-hover:text-white/40 transition-colors duration-500">
                      {item.description}
                    </p>

                    {/* Floating accent dot */}
                    <motion.div
                      className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-400/0 group-hover:bg-emerald-400/60 transition-all duration-500"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </SpotlightCard>
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
                <span className="text-xs font-mono text-emerald-400/70 tracking-[0.3em] uppercase mb-4 block">
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
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors duration-500">
                        <item.icon className="w-5 h-5 text-emerald-400/70 group-hover:text-emerald-400 transition-colors duration-500" />
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
              <MagneticCursor strength={0.3} size={80}>
                <Link
                  href="/assessment/new"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-satoshi font-semibold rounded-xl text-lg hover:bg-emerald-300 transition-all duration-300 hover:shadow-glow hover:shadow-emerald-400/30 hover:scale-105"
                >
                  <ScrambleText
                    text="Create Decision Record"
                    autoStart={false}
                    scrambleSpeed={25}
                    scrambledLetterCount={4}
                  />
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </MagneticCursor>
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
