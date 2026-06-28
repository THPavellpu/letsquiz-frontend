import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import GlowCard from "./GlowCard";
import SectionHeading from "./SectionHeading";
import Button from "../ui/Button";

function Educators() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="For classrooms"
            title="Why teachers love LetsQuiz"
            description="Turn lesson review into engaging competition — with instant insights."
          />

          <div className="mt-8 space-y-4">
            {["Classroom quizzes", "Online assessments", "Student engagement", "Instant grading", "Export results"].map(
              (t) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-300/20">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-white/85">{t}</span>
                </motion.div>
              )
            )}
          </div>
        </div>

        <div>
          <GlowCard className="bg-gradient-to-b from-white/6 to-white/2" delay={0.1} hoverable={false}>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold tracking-wider text-indigo-200">Teacher Toolkit</div>
                <div className="mt-2 text-2xl font-bold text-white">Make grading effortless</div>
                <div className="mt-2 text-sm text-white/70">
                  Create quizzes, run them live, and export results — all in one place.
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {["Analytics", "Live timer", "Rankings", "Exports"].map((x) => (
                  <div key={x} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="text-sm font-semibold text-white/90">{x}</div>
                    <div className="mt-1 text-xs text-white/60">Instant & reliable</div>
                  </div>
                ))}
              </div>

              <Button
                className="mt-2 h-11 w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-[0_18px_60px_rgba(99,102,241,0.35)]"
                onClick={() => {
                  // Lightweight CTA: scroll to FAQ/CTA.
                  document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Learn More
              </Button>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}

export default Educators;

