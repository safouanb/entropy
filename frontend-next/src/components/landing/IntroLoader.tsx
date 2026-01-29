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
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center">
            {/* "Entropy" in Instrument Serif */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-white text-5xl sm:text-6xl font-instrument italic tracking-tight select-none"
            >
              Entropy
            </motion.h1>

            {/* Emerald line expanding below */}
            <motion.div
              className="mt-5 h-[1.5px] rounded-full bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 140, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                width: {
                  duration: 1.0,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                },
                opacity: {
                  duration: 0.4,
                  delay: 0.4,
                },
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
