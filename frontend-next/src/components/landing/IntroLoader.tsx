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
          {/* Simple, elegant content */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Clean wordmark */}
            <motion.h1
              className="text-5xl md:text-6xl font-instrument italic tracking-tight text-white mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Entropy
            </motion.h1>

            {/* Simple tagline */}
            <motion.p
              className="text-sm text-white/40 font-mono tracking-[0.2em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Decision Authority
            </motion.p>

            {/* Minimal progress indicator */}
            <motion.div
              className="w-32 h-[1px] bg-white/20 mx-auto mt-8 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 1.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 1
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
