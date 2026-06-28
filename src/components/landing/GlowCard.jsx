import React from "react";
import { motion } from "framer-motion";

function GlowCard({
  children,
  className = "",
  delay = 0,
  hoverable = true,
}) {
  const MotionTag = hoverable ? motion.div : "div";

  return (
    <MotionTag
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={
        hoverable
          ? {
              y: -4,
              boxShadow: "0 18px 50px rgba(79, 70, 229, 0.35)",
            }
          : undefined
      }
      className={[
        "relative overflow-hidden rounded-2xl border border-white/10",
        "bg-gradient-to-b from-white/5 to-white/2",
        "backdrop-blur-md",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.35),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.28),transparent_50%)]" />
      <div className="relative p-5">{children}</div>
    </MotionTag>
  );
}

export default GlowCard;

