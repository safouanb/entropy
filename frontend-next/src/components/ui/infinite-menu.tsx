"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface MenuItem {
    label: string;
    link: string;
    image?: string;
}

interface InfiniteMenuProps {
    items: MenuItem[];
}

export default function InfiniteMenu({ items }: InfiniteMenuProps) {
    return (
        <div className="relative w-full h-[600px] overflow-hidden bg-black flex items-center justify-center">
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black via-transparent to-black" />

            <div className="relative z-0 flex flex-col items-center gap-4">
                {/* We duplicate the list to create the seamless loop effect */}
                <MovingList items={items} direction="up" speed={20} />
            </div>

            {/* Center Focus Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <div className="w-full h-32 bg-white/5 backdrop-blur-sm border-y border-white/10" />
            </div>
        </div>
    );
}

function MovingList({ items, direction, speed }: { items: MenuItem[], direction: 'up' | 'down', speed: number }) {
    return (
        <motion.div
            className="flex flex-col gap-8 items-center"
            animate={{
                y: direction === 'up' ? [0, -1000] : [-1000, 0]
            }}
            transition={{
                duration: speed,
                repeat: Infinity,
                ease: "linear",
            }}
        >
            {[...items, ...items, ...items, ...items].map((item, idx) => (
                <Link
                    key={`${item.label}-${idx}`}
                    href={item.link}
                    className="text-5xl font-bold text-white/20 hover:text-emerald-400 transition-colors duration-300 font-instrument italic cursor-pointer py-4"
                >
                    {item.label}
                </Link>
            ))}
        </motion.div>
    )
}
