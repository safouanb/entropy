"use client";

import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function IntroLoader({ isVisible, onComplete }: IntroLoaderProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Animated logo mark */}
          <div className="relative flex flex-col items-center gap-6">
            {/* The "E" mark */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <motion.div
                className="w-16 h-16 rounded-xl bg-white flex items-center justify-center"
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span
                  className="text-black font-bold text-3xl"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  E
                </span>
              </motion.div>

              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: [0, 0.6, 0], scale: [1, 1.8, 2.2] }}
                transition={{
                  duration: 1.5,
                  delay: 0.4,
                  ease: "easeOut",
                }}
                style={{
                  boxShadow: "0 0 60px 20px rgba(16, 185, 129, 0.3)",
                }}
              />
            </motion.div>

            {/* Brand text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="text-white text-2xl tracking-[0.3em] font-light"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                ENTROPY
              </span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
              />
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 1.4,
                  delay: 1.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
