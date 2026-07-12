import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, PlayCircle } from "lucide-react";
import DashboardMockup from "./DashboardMockup";
import Button from "../ui/Button";

function Hero() {
  return (
    <div className="relative overflow-hidden" id="top">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.35),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.28),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.18),transparent_45%)]" />

      <div className="absolute left-1/2 top-[-120px] h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="absolute right-[-120px] top-32 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 sm:pb-16 sm:pt-10 lg:pb-24 lg:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80">
              <Sparkles className="h-4 w-4 text-indigo-300" aria-hidden="true" />
              <span>Premium quizzes. Real-time competition.</span>
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Create.
              <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-200 to-blue-200 bg-clip-text text-transparent">
                {" "}Challenge.{" "}
              </span>
              Learn.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              LetsQuiz is an interactive quiz platform where anyone can create quizzes, join quizzes using a quiz code, compete with others in real-time, and instantly view results and rankings.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                className="h-12 text-base"
                onClick={() => (window.location.href = "/register")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("how-it-works");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 text-base font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <PlayCircle className="h-4 w-4 text-indigo-200" aria-hidden="true" />
                See How It Works
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[{ label: "Real-time", value: "Live" }, { label: "Quiz Code", value: "Instant" }, { label: "Results", value: "Rankings" }].map(
                (s, idx) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.12 * idx }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="text-xs font-semibold text-white/70">{s.label}</div>
                    <div className="mt-1 text-base font-bold text-white">{s.value}</div>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
            className="relative"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Hero;

