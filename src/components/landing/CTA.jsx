import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";

import { applyRippleEffect } from "./ripple";

function CTA() {
  return (
    <div
      id="cta"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/15 to-blue-500/10 p-8 sm:p-12"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.35),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(168,85,247,0.28),transparent_45%)]" />
      <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="text-xs font-semibold tracking-wider text-white/70">Ready to challenge yourself?</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to challenge yourself?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Create quizzes, join using a code, and compete with others in real time — with instant results.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end md:pl-10">
          <Button
            className="relative h-11 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-[0_18px_60px_rgba(99,102,241,0.35)] overflow-hidden"
            onClick={(e) => {
              applyRippleEffect(e);
              window.location.href = "/register";
            }}
          >
            Create Account
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
          <button
            type="button"
            onClick={() => (window.location.href = "/login")}
            className="h-11 rounded-md border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default CTA;

