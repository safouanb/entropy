"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ScrambleText } from "@/components/ui/scramble-text";

interface IntroLoaderProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function IntroLoader({ isVisible, onComplete }: IntroLoaderProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
                initial={{
                  x: Math.random() * 1920,
                  y: Math.random() * 1080,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * 1920,
                  y: Math.random() * 1080,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Pulsing border effect */}
          <motion.div
            className="absolute inset-4 border border-emerald-400/20 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.95, 1.02, 0.95]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="relative flex flex-col items-center">
            {/* "Entropy" with Scramble Effect */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-white text-5xl sm:text-6xl font-instrument italic tracking-tight select-none"
            >
              <ScrambleText
                text="Entropy"
                scrambleSpeed={80}
                scrambledLetterCount={3}
                delay={200}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
              />
            </motion.div>

            {/* Subtitle with scramble */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-emerald-400/60 text-sm font-mono tracking-[0.3em] uppercase mt-2"
            >
              <ScrambleText
                text="DECISION AUTHORITY"
                scrambleSpeed={60}
                scrambledLetterCount={4}
                delay={800}
                characters="0123456789"
              />
            </motion.div>

            {/* Enhanced emerald line with gradient animation */}
            <motion.div
              className="relative mt-6 h-[2px] rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: 160 }}
              transition={{
                duration: 1.2,
                delay: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  delay: 1.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </motion.div>
          </div>

          {/* Corner accents */}
          {[
            { position: "top-4 left-4", rotation: 0 },
            { position: "top-4 right-4", rotation: 90 },
            { position: "bottom-4 right-4", rotation: 180 },
            { position: "bottom-4 left-4", rotation: 270 },
          ].map((corner, i) => (
            <motion.div
              key={i}
              className={`absolute ${corner.position} w-6 h-6`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              style={{ transform: `rotate(${corner.rotation}deg)` }}
            >
              <div className="w-4 h-[1px] bg-emerald-400/40" />
              <div className="w-[1px] h-4 bg-emerald-400/40" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
