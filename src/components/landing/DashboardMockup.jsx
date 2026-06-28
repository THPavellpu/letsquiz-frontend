import React from "react";
import { motion } from "framer-motion";
import { Timer, Users, Trophy, TrendingUp, CheckCircle2 } from "lucide-react";

const Row = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="flex items-center gap-2 text-white/80">
        <Icon className="h-4 w-4 text-indigo-300" aria-hidden="true" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-xs font-semibold text-white">{value}</div>
    </div>
  );
};

function DashboardMockup() {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/2 p-5 shadow-[0_30px_120px_rgba(79,70,229,0.22)]"
      >
        <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-indigo-500/30 blur-2xl" />
        <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-fuchsia-500/25 blur-2xl" />

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold tracking-wide text-indigo-200">Live Quiz</div>
            <div className="mt-1 text-sm font-semibold text-white">Question 3 / 10</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-white/70">
              <Timer className="h-4 w-4 text-indigo-300" aria-hidden="true" />
              <span>Countdown</span>
            </div>
            <div className="mt-1 text-xl font-bold text-white">00:12</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="text-xs font-medium text-white/70">Selected Answer</div>
            <div className="mt-2 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">B) Adaptive Learning</div>
                <div className="mt-2 text-xs text-white/60">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                    Locked in — scoring updates in real-time.
                  </span>
                </div>
              </div>
              <motion.div
                className="h-10 w-10 rounded-xl border border-white/10 bg-gradient-to-b from-indigo-500/30 to-fuchsia-500/20"
                animate={{ rotate: [0, 6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Row icon={Users} label="Players" value="247" />
          <Row icon={Trophy} label="Rank" value="#7" />
          <Row icon={TrendingUp} label="Score" value="83 pts" />
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-xs font-medium text-white/70">Status</div>
            <div className="mt-1 text-xs font-semibold text-white">Scoring…</div>
          </div>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute -left-4 -top-4 h-16 w-16 rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(99,102,241,0.25)]" />
      <div className="pointer-events-none absolute -right-2 top-24 h-14 w-14 rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(168,85,247,0.25)]" />

      <motion.div
        className="pointer-events-none absolute -right-6 -bottom-6 rounded-3xl border border-white/10 bg-gradient-to-b from-indigo-500/20 to-fuchsia-500/10 px-4 py-3"
        initial={{ opacity: 0, y: 10, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
      >
        <div className="text-xs font-semibold text-white">Top 3</div>
        <div className="mt-2 space-y-2">
          {["Nova", "Mason", "Ava"].map((n, idx) => (
            <div
              key={n}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <span className="text-white/80">{idx + 1}. {n}</span>
              <span className="font-semibold text-white">{92 - idx * 3}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardMockup;

