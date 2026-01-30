"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ScrambleTextProps {
  text: string;
  scrambleSpeed?: number;
  scrambledLetterCount?: number;
  autoStart?: boolean;
  className?: string;
  onComplete?: () => void;
  onStart?: () => void;
  characters?: string;
  delay?: number;
}

export function ScrambleText({
  text,
  scrambleSpeed = 50,
  scrambledLetterCount = 8,
  autoStart = true,
  className = "",
  onComplete,
  onStart,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
  delay = 0,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = () => {
    if (isScrambling) return;

    setIsScrambling(true);
    onStart?.();

    let currentIndex = 0;
    const totalLength = text.length;

    const scrambleInterval = setInterval(() => {
      let newText = "";

      // Build the revealed portion
      for (let i = 0; i < currentIndex; i++) {
        newText += text[i];
      }

      // Add scrambled letters
      for (let i = 0; i < Math.min(scrambledLetterCount, totalLength - currentIndex); i++) {
        if (currentIndex + i < totalLength) {
          if (text[currentIndex + i] === " ") {
            newText += " ";
          } else {
            newText += characters[Math.floor(Math.random() * characters.length)];
          }
        }
      }

      setDisplayText(newText);

      // Move to next character
      currentIndex++;

      if (currentIndex > totalLength) {
        clearInterval(scrambleInterval);
        setDisplayText(text);
        setIsScrambling(false);
        onComplete?.();
      }
    }, scrambleSpeed);

    intervalRef.current = scrambleInterval;
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDisplayText("");
    setIsScrambling(false);
  };

  useEffect(() => {
    if (autoStart) {
      timeoutRef.current = setTimeout(() => {
        scramble();
      }, delay);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoStart, delay]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText || text}
    </motion.span>
  );
}