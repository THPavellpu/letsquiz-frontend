import React from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Code2,
  Users,
  Timer,
  Sparkles,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
} from "lucide-react";
import GlowCard from "./GlowCard";
import SectionHeading from "./SectionHeading";

const features = [
  {
    icon: PlusCircle,
    title: "Create Quizzes",
    bullets: ["Unlimited quizzes", "Multiple question types"],
  },
  {
    icon: Code2,
    title: "Join with Quiz Code",
    bullets: ["Enter quiz code", "Join instantly"],
  },
  {
    icon: Users,
    title: "Real-time Competition",
    bullets: ["Live timer", "Live leaderboard"],
  },
  {
    icon: Sparkles,
    title: "Instant Results",
    bullets: ["Scores", "Analytics"],
  },
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    bullets: ["JWT login", "Email verification", "Password reset"],
  },
];

function Features() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <SectionHeading
          eyebrow="Built for speed"
          title="Everything you need to run quizzes that feel premium"
          description="Create, compete, and learn — all with a smooth real-time experience."
        />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <GlowCard key={f.title} delay={idx * 0.05}>
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-xl border border-white/10 bg-indigo-500/15 p-2">
                  <Icon className="h-5 w-5 text-indigo-200" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{f.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-white/70">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-indigo-200">
                          <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlowCard>
          );
        })}
      </div>
    </div>
  );
}

export default Features;

