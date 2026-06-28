import React from "react";
import { motion } from "framer-motion";
import { Plus, CheckCircle2, BarChart3 } from "lucide-react";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    icon: Plus,
    title: "Create or Join Quiz",
    description: "Start instantly with a quiz code — or build your own quiz in minutes.",
    points: ["Generate quizzes", "Share quiz codes"],
  },
  {
    icon: CheckCircle2,
    title: "Answer Questions",
    description: "Real-time prompts, live timer, and dynamic scoring as you play.",
    points: ["Pick answers", "Watch leaderboard update"],
  },
  {
    icon: BarChart3,
    title: "See Results",
    description: "Instant results, rankings, and performance insights for every player.",
    points: ["View scores", "Analyze outcomes"],
  },
];

function HowItWorks() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Flow that feels effortless"
        title="How it works"
        description="Three simple steps from setup to results — designed for clarity and speed."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: "easeOut" }}
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/2 p-6"
            >
              <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/15 blur-2xl" />
              <div className="absolute -right-14 bottom-0 h-24 w-24 rounded-full bg-fuchsia-500/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <Icon className="h-6 w-6 text-indigo-200" aria-hidden="true" />
                  </div>
                  <div className="text-sm font-bold text-white/90">Step {idx + 1}</div>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{s.description}</p>

                <div className="mt-5 space-y-2">
                  {s.points.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-sm text-white/75">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-indigo-200">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default HowItWorks;

