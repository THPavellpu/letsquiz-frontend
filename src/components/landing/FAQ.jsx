import React from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How do I join a quiz?",
    a: "Enter the quiz code on the Join Quiz page. Once started, your results will update in real time.",
  },
  {
    q: "Is LetsQuiz suitable for educators?",
    a: "Yes. You can create classroom quizzes, run online assessments, and export results instantly.",
  },
  {
    q: "Do you support secure authentication?",
    a: "Yes. Login uses JWT, and the platform includes email verification and password reset flows.",
  },
  {
    q: "When will pricing be available?",
    a: "Pricing is coming soon. For now, start free and explore the platform.",
  },
];

function FAQ() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8" id="faq">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <HelpCircle className="h-6 w-6 text-indigo-200" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">FAQ</h2>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {faqs.map((f, idx) => (
          <motion.div
            key={f.q}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: idx * 0.06, ease: "easeOut" }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/2 p-6"
          >
            <div className="text-base font-semibold text-white">{f.q}</div>
            <div className="mt-2 text-sm leading-relaxed text-white/70">{f.a}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;

