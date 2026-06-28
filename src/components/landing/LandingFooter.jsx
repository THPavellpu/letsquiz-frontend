import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

const social = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div>
            <div className="text-sm font-semibold text-white">LetsQuiz</div>
            <div className="mt-3 text-sm text-white/65">
              Create. Challenge. Learn.
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Product</div>
            <ul className="mt-3 space-y-2 text-sm text-white/65">
              <li>Features</li>
              <li>Pricing</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-white/65">
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Support</div>
            <ul className="mt-3 space-y-2 text-sm text-white/65">
              <li>Help Center</li>
              <li>Report Issue</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-white/60">Newsletter</div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <label className="sr-only" htmlFor="newsletter-email">Email</label>
            <input
              id="newsletter-email"
              className="h-11 w-full rounded-md border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:w-72"
              placeholder="Email address"
            />
            <button
              type="button"
              className="h-11 rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Subscribe
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-6 text-sm text-white/60">
          <div>© {new Date().getFullYear()} LetsQuiz</div>
          <div className="flex items-center gap-3">
            {social.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition hover:bg-white/10"
                  aria-label={s.label}
                >
                  <Icon className="h-4 w-4 text-white/80" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;

