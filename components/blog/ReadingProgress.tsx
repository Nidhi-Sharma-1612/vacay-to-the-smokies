"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin bar under the header that fills as the reader scrolls through the article. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-20 z-40 h-0.5 origin-left bg-ember-500" />;
}
