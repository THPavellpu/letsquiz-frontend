import React from "react";

// Avoid lucide-react named imports here because this project’s lucide-react build
// does not export some brand icons (Github/Twitter/Linkedin) in production builds.
// Using simple inline SVGs prevents build-time missing-export errors.
const social = [
  {
    label: "GitHub",
    href: "#",
    Icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 .5C5.73.5.5 5.96.5 12.37c0 5.33 3.44 9.85 8.2 11.45.6.12.82-.26.82-.58v-2.03c-3.34.74-4.04-1.62-4.04-1.62-.55-1.41-1.35-1.78-1.35-1.78-1.1-.77.08-.75.08-.75 1.22.09 1.87 1.29 1.87 1.29 1.08 1.87 2.84 1.33 3.53 1.02.11-.79.42-1.33.76-1.64-2.67-.32-5.47-1.37-5.47-6.1 0-1.35.47-2.45 1.24-3.31-.12-.33-.54-1.6.12-3.33 0 0 1.01-.33 3.31 1.26.95-.27 1.98-.41 3-.42 1.02.01 2.05.15 3 .42 2.3-1.59 3.31-1.26 3.31-1.26.66 1.73.24 3 .12 3.33.77.86 1.24 1.96 1.24 3.31 0 4.74-2.8 5.78-5.48 6.09.43.39.82 1.14.82 2.3v3.4c0 .32.22.7.83.58 4.75-1.6 8.19-6.12 8.19-11.45C23.5 5.96 18.27.5 12 .5z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    Icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M21.5 7.1c.01.2.01.4.01.6 0 6.1-4.7 13.1-13.1 13.1-2.6 0-5-.8-7-2.1.4.05.8.06 1.2.06 2.1 0 4-.7 5.5-2-2-.04-3.6-1.3-4.2-3.1.3.05.6.09.9.09.4 0 .8-.06 1.2-.16-2.1-.43-3.6-2.3-3.6-4.5v-.06c.6.35 1.4.58 2.2.61-1.2-.8-1.9-2.2-1.9-3.7 0-.8.2-1.6.6-2.3 2.4 2.9 6 4.8 10.1 5 .1-.34.1-.7.1-1.1 0-2.6 2.1-4.7 4.7-4.7 1.4 0 2.5.58 3.4 1.5 1.1-.2 2.1-.6 3.1-1.2-.36 1.1-1.1 2-2.1 2.6 1-.12 1.9-.38 2.8-.77-.66 1-1.5 1.8-2.5 2.5z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    Icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 23.5V7.98h4V23.5h-4zM8 7.98h3.83v2.12h.05c.53-1 1.84-2.06 3.79-2.06 4.06 0 4.81 2.67 4.81 6.14v9.32h-4v-8.26c0-1.97-.04-4.5-2.75-4.5-2.75 0-3.17 2.15-3.17 4.36v8.4H8V7.98z" />
      </svg>
    ),
  },
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

