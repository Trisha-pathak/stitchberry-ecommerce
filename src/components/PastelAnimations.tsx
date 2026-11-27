"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";

/**
 * Custom Desktop Yarn-Ball Cursor with trailing pastel stitch dot
 */
export function YarnCursor() {
  const { yarnCursorEnabled } = useStore();
  const prefersReduced = useReducedMotion();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    if (prefersReduced || !yarnCursorEnabled) {
      document.documentElement.classList.remove("yarn-cursor-active");
      return;
    }
    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 1024);
    if (isTouch) {
      document.documentElement.classList.remove("yarn-cursor-active");
      return;
    }

    document.documentElement.classList.add("yarn-cursor-active");

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = target.closest("a, button, input, select, textarea, [role='button']");
        setIsPointer(Boolean(clickable));
      }
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.classList.remove("yarn-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [yarnCursorEnabled, prefersReduced]);

  if (!visible || prefersReduced || !yarnCursorEnabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
      {/* Trailing soft thread dot */}
      <motion.div
        animate={{ x: pos.x - 5, y: pos.y - 5 }}
        transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.4 }}
        className="fixed w-2.5 h-2.5 rounded-full bg-powder-blue/80 border border-cocoa/30"
      />
      {/* Tiny crochet yarn ball */}
      <motion.div
        animate={{
          x: pos.x - 13,
          y: pos.y - 13,
          scale: isPointer ? 1.25 : 1,
          rotate: isPointer ? 35 : 0,
        }}
        transition={{ type: "spring", stiffness: 520, damping: 32, mass: 0.2 }}
        className="fixed w-7 h-7"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-sm">
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="#F7C6D9"
            stroke="#59434A"
            strokeWidth="2"
          />
          <path
            d="M7 12 Q16 6 25 13 M6 18 Q16 12 26 19 M9 23 Q16 19 23 24"
            fill="none"
            stroke="#59434A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M24 23 Q29 26 30 30"
            fill="none"
            stroke="#BFE3F5"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * Animated Wool Threads falling gracefully from the top of the page
 */
export function FallingWoolThreads() {
  const prefersReduced = useReducedMotion();
  const threads = [
    { left: "6%", color: "#F7C6D9", height: 150, delay: 0 },
    { left: "19%", color: "#BFE3F5", height: 110, delay: 0.4 },
    { left: "82%", color: "#E7DDF7", height: 135, delay: 0.2 },
    { left: "93%", color: "#F7C6D9", height: 95, delay: 0.6 },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 inset-x-0 z-10 overflow-hidden h-56"
    >
      {threads.map((t, i) => (
        <motion.div
          key={i}
          initial={prefersReduced ? false : { y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 0.75 }}
          transition={{ duration: 1.2, delay: t.delay, ease: "easeOut" }}
          style={{ left: t.left }}
          className="absolute top-0 hidden md:block"
        >
          <motion.svg
            width="28"
            height={t.height}
            viewBox={`0 0 28 ${t.height}`}
            animate={
              prefersReduced
                ? undefined
                : { rotate: [-2.5, 2.5, -2.5] }
            }
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "top center" }}
          >
            <path
              d={`M14 0 Q20 ${t.height * 0.35} 12 ${t.height * 0.7} T15 ${t.height - 14}`}
              fill="none"
              stroke={t.color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx="15"
              cy={t.height - 10}
              r="7"
              fill={t.color}
              stroke="#59434A"
              strokeWidth="1.5"
            />
          </motion.svg>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Crochet yarn ball that rolls & rotates smoothly on scroll
 */
export function RollingYarnTracker() {
  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotion();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 1080]);
  const y = useTransform(scrollYProgress, [0, 1], [110, 420]);

  if (prefersReduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ y }}
      className="fixed left-3 z-20 hidden xl:flex flex-col items-center pointer-events-none"
    >
      <div className="w-0.5 h-16 bg-gradient-to-b from-transparent via-powder-pink to-powder-blue opacity-70" />
      <motion.div style={{ rotate }} className="w-11 h-11 drop-shadow-md">
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="#BFE3F5"
            stroke="#59434A"
            strokeWidth="2.5"
          />
          <path
            d="M10 17 Q24 8 38 18 M8 25 Q24 16 40 26 M12 34 Q24 27 36 35 M18 8 Q14 24 20 40"
            fill="none"
            stroke="#59434A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="30" cy="14" r="3" fill="#FFF8ED" opacity="0.8" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/**
 * Background floating crochet flowers, hearts & stars
 */
export function FloatingCraftMotifs() {
  const prefersReduced = useReducedMotion();
  const items = [
    { x: "8%", y: "22%", kind: "flower", color: "#F7C6D9", delay: 0 },
    { x: "91%", y: "28%", kind: "star", color: "#FFF0B8", delay: 1.1 },
    { x: "14%", y: "64%", kind: "heart", color: "#FADCE8", delay: 0.6 },
    { x: "88%", y: "72%", kind: "flower", color: "#BFE3F5", delay: 1.6 },
    { x: "50%", y: "14%", kind: "star", color: "#E7DDF7", delay: 0.8 },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          style={{ left: item.x, top: item.y }}
          animate={
            prefersReduced
              ? undefined
              : {
                  y: [0, -14, 0],
                  rotate: [-6, 6, -6],
                }
          }
          transition={{
            duration: 6 + idx,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
          className="absolute opacity-45"
        >
          {item.kind === "flower" && (
            <svg width="34" height="34" viewBox="0 0 36 36">
              <circle cx="18" cy="8" r="6" fill={item.color} />
              <circle cx="27" cy="15" r="6" fill={item.color} />
              <circle cx="23" cy="25" r="6" fill={item.color} />
              <circle cx="13" cy="25" r="6" fill={item.color} />
              <circle cx="9" cy="15" r="6" fill={item.color} />
              <circle cx="18" cy="17" r="5" fill="#FFF0B8" />
            </svg>
          )}
          {item.kind === "star" && (
            <svg width="26" height="26" viewBox="0 0 24 24">
              <path
                d="M12 2 L14.8 8.5 L22 9.2 L16.5 13.8 L18.2 21 L12 17.2 L5.8 21 L7.5 13.8 L2 9.2 L9.2 8.5 Z"
                fill={item.color}
                stroke="#59434A"
                strokeOpacity="0.25"
                strokeWidth="1.2"
              />
            </svg>
          )}
          {item.kind === "heart" && (
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M12 21s-7-4.5-9.2-8.7C1 8.8 3.2 5 6.8 5c2 0 3.7 1.1 5.2 2.8C13.5 6.1 15.2 5 17.2 5 20.8 5 23 8.8 21.2 12.3 19 16.5 12 21 12 21z"
                fill={item.color}
              />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Crochet needle following a wool thread across section transitions
 */
export function CrochetNeedleDivider({ flip = false }: { flip?: boolean }) {
  const prefersReduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`relative w-full max-w-5xl mx-auto py-4 px-6 overflow-hidden ${
        flip ? "scale-x-[-1]" : ""
      }`}
    >
      <svg viewBox="0 0 800 64" className="w-full h-14 overflow-visible">
        <motion.path
          d="M 10 38 Q 140 8, 260 36 T 520 34 T 790 28"
          fill="none"
          stroke="#F7C6D9"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="10 7"
          initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        <motion.g
          initial={prefersReduced ? { x: 730, opacity: 1 } : { x: 20, opacity: 0 }}
          whileInView={{ x: 730, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {/* Cute pastel crochet hook */}
          <rect
            x="-45"
            y="18"
            width="46"
            height="10"
            rx="5"
            fill="#BFE3F5"
            stroke="#59434A"
            strokeWidth="2"
          />
          <path
            d="M 1 23 L 22 23 C 27 23 28 16 22 16"
            fill="none"
            stroke="#59434A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </motion.g>
      </svg>
    </div>
  );
}

/**
 * Section Heading with self-drawing wool thread underline/loop
 */
export function AnimatedHeading({
  eyebrow,
  title,
  subtitle,
  centered = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className={centered ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-butter-yellow/90 border border-cocoa/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-cocoa mb-3 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-powder-pink" />
          {eyebrow}
        </span>
      )}
      <div className="relative inline-block">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-cocoa tracking-tight">
          {title}
        </h2>
        <svg
          viewBox="0 0 320 22"
          className="w-full h-5 mt-1 overflow-visible"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M4 12 Q80 2 160 13 T316 10"
            fill="none"
            stroke="#F7C6D9"
            strokeWidth="4.5"
            strokeLinecap="round"
            initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.15 }}
          />
          <motion.path
            d="M24 16 Q110 8 200 17 T305 14"
            fill="none"
            stroke="#BFE3F5"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            strokeLinecap="round"
            initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </svg>
      </div>
      {subtitle && (
        <p className="mt-3 text-cocoa-light text-base sm:text-lg leading-relaxed font-medium">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/**
 * Wool-thread page transition loader when navigating between pages
 */
export function RouteWoolLoader() {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [pathname, prefersReduced]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 inset-x-0 z-[100] pointer-events-none"
        >
          <div className="h-1.5 w-full bg-baby-pink/40 overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="h-full w-1/2 rounded-full bg-gradient-to-r from-powder-pink via-butter-yellow to-powder-blue"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
