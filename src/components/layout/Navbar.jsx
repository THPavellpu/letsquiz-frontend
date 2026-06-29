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
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  const routeLabel = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith("/create-quiz")) return "Create";
    if (p.startsWith("/dashboard")) return "Dashboard";
    if (p.startsWith("/analytics")) return "Analytics";
    if (p.startsWith("/leaderboard")) return "Leaderboard";
    if (p.startsWith("/quiz/")) return "Quiz";
    if (p.startsWith("/results/")) return "Results";
    if (p.startsWith("/join-quiz")) return "Join";
    if (p.startsWith("/my-performance")) return "My Performance";
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    function onDocMouseDown(e) {
      if (!mobileMenuOpen) return;

      const menu = mobileMenuRef.current;
      const btn = mobileMenuButtonRef.current;
      if (!menu || !btn) return;

      if (btn.contains(e.target) || menu.contains(e.target)) return;
      setMobileMenuOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Close mobile menu when screen changes from mobile to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 640) {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    try {
      logout();
    } finally {
      navigate("/");
    }
  };

  // Mobile navigation items
  const mobileNavItems = useMemo(() => {
    const items = [];

    if (isAuthenticated) {
      items.push(
        { key: "dashboard", label: "Dashboard", href: "/dashboard" },
        { key: "create-quiz", label: "Create Quiz", href: "/create-quiz" },
        { key: "join-quiz", label: "Join Quiz", href: "/join-quiz" },
        { key: "my-performance", label: "My Performance", href: "/my-performance" },
        { key: "profile", label: "Profile", href: "/profile" }
      );
    } else {
      items.push(
        { key: "login", label: "Login", href: "/login" },
        { key: "register", label: "Register", href: "/register" }
      );
    }

    return items;
  }, [isAuthenticated]);

  // Additional mobile menu items that need special handling (logout)
  const mobileMenuActions = useMemo(() => {
    const actions = [];

    if (isAuthenticated) {
      actions.push(
        { key: "logout", label: "Logout", onClick: handleLogout, isLogout: true }
      );
    }

    return actions;
  }, [isAuthenticated]);

  const handleMobileNavClick = (href) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  // Icon components for navigation items
  const MenuIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const DashboardIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );

  const CreateQuizIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );

  const JoinQuizIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );

  const PerformanceIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const ProfileIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const LogoutIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  const getIcon = (key) => {
    switch (key) {
      case "dashboard": return <DashboardIcon />;
      case "create-quiz": return <CreateQuizIcon />;
      case "join-quiz": return <JoinQuizIcon />;
      case "my-performance": return <PerformanceIcon />;
      case "profile": return <ProfileIcon />;
      case "logout": return <LogoutIcon />;
      default: return null;
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
            ref={mobileMenuButtonRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-600 bg-slate-800 text-slate-200 transition hover:bg-slate-700 sm:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setMobileMenuOpen((v) => !v);
              }
            }}
          >
            <span className="sr-only">Menu</span>
            <div className="relative h-4 w-5">
              <div
                className={[
                  "absolute left-0 top-0 h-0.5 w-full bg-slate-400 transition duration-200",
                  mobileMenuOpen ? "translate-y-1.5 rotate-45" : "",
                ].join(" ")}
              />
              <div
                className={[
                  "absolute left-0 top-2 h-0.5 w-full bg-slate-400 transition duration-200",
                  mobileMenuOpen ? "opacity-0" : "",
                ].join(" ")}
              />
              <div
                className={[
                  "absolute left-0 top-4 h-0.5 w-full bg-slate-400 transition duration-200",
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

      {/* Mobile Navigation Drawer - Slide-in from left */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={[
          "fixed inset-0 z-[60] sm:hidden",
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          className={[
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            mobileMenuOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          className={[
            "absolute left-0 top-0 h-full w-72 max-w-[85%] transform transition-transform duration-300 ease-out",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          aria-hidden="true"
        >
          <div className="flex h-full flex-col bg-slate-900 border-r border-slate-700 shadow-xl">
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4 shrink-0">
              <span className="text-base font-semibold text-white">Menu</span>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <nav className="flex-1 overflow-y-auto p-3" role="navigation" aria-label="Mobile navigation">
              <ul className="space-y-1.5" role="list">
                {mobileNavItems.map((item) => {
                  const isActive = location.pathname === item.href ||
                    (item.href !== "/" && location.pathname.startsWith(item.href));
                  return (
                    <li key={item.key} role="none">
                      <button
                        type="button"
                        onClick={() => handleMobileNavClick(item.href)}
                        className={[
                          "flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-base font-medium transition duration-200 min-h-[48px]",
                          isActive
                            ? "bg-indigo-600 text-white shadow-md"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white",
                        ].join(" ")}
                        aria-current={isActive ? "page" : undefined}
                        role="menuitem"
                      >
                        <span className={[
                          "flex-shrink-0",
                          isActive ? "text-white" : "text-slate-400"
                        ].join(" ")}>
                          {getIcon(item.key)}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
                {mobileMenuActions.map((action) => (
                  <li key={action.key} role="none">
                    <button
                      type="button"
                      onClick={action.onClick}
                      className={[
                        "flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-base font-medium transition duration-200 min-h-[48px]",
                        action.isLogout
                          ? "text-red-400 hover:bg-red-900/40 hover:text-red-300"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white",
                      ].join(" ")}
                      role="menuitem"
                    >
                      <span className="flex-shrink-0 text-red-400">
                        {getIcon(action.key)}
                      </span>
                      <span className="truncate">{action.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;


