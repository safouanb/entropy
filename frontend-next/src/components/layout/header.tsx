"use client";

import Link from "next/link";
import { GlobeEuropeAfricaIcon } from "@heroicons/react/24/outline";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-instrument italic text-xl text-white tracking-tight group-hover:text-emerald-300 transition-colors duration-300">
            Entropy
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link
            href="/about"
            className="text-sm text-white/50 hover:text-white transition-colors duration-300 font-satoshi"
          >
            About
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-white text-black text-sm font-satoshi font-medium rounded-lg hover:bg-emerald-300 hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            Launch Console
          </Link>
        </div>
      </div>
    </header>
  );
}
