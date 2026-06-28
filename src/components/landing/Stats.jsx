import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

function useCountUp(target, startWhen) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!startWhen) return;
    const start = performance.now();
    const duration = 1100;

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // EaseOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, startWhen]);

  return value;
}

function StatsCounterCard({ label, target, suffix }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(target, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/2 p-6"
    >
      <div className="text-3xl font-extrabold tracking-tight text-white">
        {count}
        {suffix}
      </div>
      <div className="mt-3 text-sm font-semibold text-white/70">{label}</div>
    </motion.div>
  );
}

function Stats() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Built for learners"
        title="Statistics that reflect real impact"
        description="From active users to answered questions — LetsQuiz keeps everything fast and engaging."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCounterCard label="Active Users" target={1000} suffix="+" />
        <StatsCounterCard label="Quizzes Created" target={500} suffix="+" />
        <StatsCounterCard label="Questions Answered" target={50000} suffix="+" />
        <StatsCounterCard label="User Satisfaction" target={98} suffix="%" />
      </div>
    </div>
  );
}

export default Stats;

