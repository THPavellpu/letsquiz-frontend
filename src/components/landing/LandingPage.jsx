import React from "react";
import { motion } from "framer-motion";

import LandingNavbar from "./LandingNavbar";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Educators from "./Educators";
import Stats from "./Stats";
import CTA from "./CTA";
import LandingFooter from "./LandingFooter";
import FAQ from "./FAQ";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNavbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Hero />

        <div id="features">
          <Features />
        </div>

        <div id="how-it-works">
          <HowItWorks />
        </div>

        <div id="educators">
          <Educators />
        </div>

        <div>
          <Stats />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
          <CTA />
        </div>

        <FAQ />
        <LandingFooter />
      </motion.div>
    </div>
  );
}




