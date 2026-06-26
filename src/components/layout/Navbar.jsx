import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Branding from "./Branding";

function Navbar({ className = "" }) {
  const { logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileButtonRef = useRef(null);
  const profilePanelRef = useRef(null);

  const routeLabel = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith("/create-quiz")) return "Create";
    if (p.startsWith("/dashboard")) return "Dashboard";
    if (p.startsWith("/analytics")) return "Analytics";
    if (p.startsWith("/leaderboard")) return "Leaderboard";
    if (p.startsWith("/quiz/")) return "Quiz";
    if (p.startsWith("/results/")) return "Results";
    if (p.startsWith("/join-quiz")) return "Join";
    if (p.startsWith("/profile")) return "Profile";
    if (p.startsWith("/login")) return "Login";
    if (p.startsWith("/register")) return "Register";
    return "LetsQuiz";
  }, [location.pathname]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!profileOpen) return;

      const btn = profileButtonRef.current;
      const panel = profilePanelRef.current;
      if (!btn || !panel) return;

      if (btn.contains(e.target) || panel.contains(e.target)) return;
      setProfileOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [profileOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      logout();
    } finally {
      navigate("/login");
    }
  };

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/80 backdrop-blur transition-colors",
        className,
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-600 bg-slate-800 text-slate-200 transition hover:bg-slate-700 sm:hidden"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="relative h-4 w-5">
              <div
                className={[
                  "absolute left-0 top-0 h-0.5 w-full bg-slate-400 transition",
                  mobileMenuOpen ? "translate-y-1.5 rotate-45" : "",
                ].join(" ")}
              />
              <div
                className={[
                  "absolute left-0 top-2 h-0.5 w-full bg-slate-400 transition",
                  mobileMenuOpen ? "opacity-0" : "",
                ].join(" ")}
              />
              <div
                className={[
                  "absolute left-0 top-4 h-0.5 w-full bg-slate-400 transition",
                  mobileMenuOpen ? "-translate-y-1.5 -rotate-45" : "",
                ].join(" ")}
              />
            </div>
          </button>

          <div className="flex items-center gap-2">
            <Branding size="w-12 h-12" />
            <span className="hidden text-xs font-medium text-slate-400 sm:inline">
              {routeLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-md border border-slate-600 bg-slate-800 p-2 text-slate-200 transition hover:bg-slate-700"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            <span className="text-sm font-semibold">{isDark ? "☀" : "🌙"}</span>
          </button>
          {isAuthenticated ? (
            <div className="relative">
              <button
                ref={profileButtonRef}
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((v) => !v)}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">
                  P
                </span>
                <span className="hidden sm:inline">Profile</span>
                <svg
                  className={[
                    "h-4 w-4 transition-transform",
                    profileOpen ? "rotate-180" : "",
                  ].join(" ")}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div
                ref={profilePanelRef}
                className={[
                  "absolute right-0 mt-2 w-52 origin-top-right rounded-lg border border-slate-600 bg-slate-800 shadow-lg ring-1 ring-black/5 transition",
                  profileOpen
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0",
                ].join(" ")}
                role="menu"
                aria-label="Profile menu"
              >
                <div className="p-2">
                  <button
                    type="button"
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-700"
                    onClick={() => navigate("/profile")}
                    role="menuitem"
                  >
                    View profile
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar toggle hook: actual Sidebar is controlled by PageContainer */}
      <div className="hidden" aria-hidden="true" data-mobile-menu-open={mobileMenuOpen} />
    </header>
  );
}

export default Navbar;


