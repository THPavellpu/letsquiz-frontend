import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Branding from "./Branding";

function Navbar({ className = "" }) {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  // Track if component is mounted (for Portal rendering)
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
  // NOTE: AuthContext's isAuthenticated is derived from token, so this drawer should never be empty.
  // If you ever see an empty drawer, ensure the token value is set correctly and/or that this
  // component is not being unmounted/remounted unexpectedly on mobile.
  const mobileNavItems = useMemo(() => {
    const items = [];

    if (isAuthenticated) {
      items.push(
        { key: "dashboard", label: "Dashboard", href: "/dashboard" },
        { key: "create-quiz", label: "Create Quiz", href: "/create-quiz" },
        { key: "join-quiz", label: "Join Quiz", href: "/join-quiz" },
        { key: "my-performance", label: "My Performance", href: "/my-performance" },
        { key: "profile", label: "Profile", href: "/profile" },
      );
    } else {
      items.push(
        { key: "login", label: "Login", href: "/login" },
        { key: "register", label: "Register", href: "/register" },
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

  const MyQuizzesIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
      case "my-quizzes": return <MyQuizzesIcon />;
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center sm:justify-between px-4 sm:px-6 lg:px-8">
        <div className="absolute left-4 sm:static flex items-center gap-3">
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
            <span className="hidden text-xs font-medium text-slate-400 md:block lg:hidden">
              {routeLabel}
            </span>
          </div>
        </div>

        {/* Desktop Navigation - visible on big screens */}
        <nav className="hidden sm:flex items-center gap-1" role="navigation" aria-label="Desktop navigation">
          <ul className="flex items-center gap-1" role="list">
            {mobileNavItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href));
              return (
                <li key={item.key} role="none">
                  <button
                    type="button"
                    onClick={() => handleMobileNavClick(item.href)}
                    className={[
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition duration-200",
                      isActive
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                    role="menuitem"
                  >
                    <span className={isActive ? "text-white" : "text-slate-400"}>
                      {getIcon(item.key)}
                    </span>
                    <span className="hidden lg:inline">{item.label}</span>
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
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition duration-200",
                    action.isLogout
                      ? "text-red-400 hover:bg-red-900/40 hover:text-red-300"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  ].join(" ")}
                  role="menuitem"
                >
                  <span className="text-red-400">
                    {getIcon(action.key)}
                  </span>
                  <span className="hidden lg:inline">{action.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation Drawer - Rendered via Portal to avoid sticky stacking context issues */}
      {isMounted && createPortal(
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={[
            "fixed inset-0 z-[9999] sm:hidden",
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
              "absolute left-0 top-0 z-[9999] h-full w-72 max-w-[85%] transform transition-transform duration-300 ease-out",
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
              <nav className="flex flex-1 flex-col overflow-y-auto p-3" role="navigation" aria-label="Mobile navigation">
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
        </div>,
        document.body
      )}
    </header>
  );
}

export default Navbar;


