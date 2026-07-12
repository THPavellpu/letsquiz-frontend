import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  LayoutDashboard,
  PlusCircle,
  LogIn,
  BarChart3,
  User,
  LogOut,
  X,
  Menu,
  ChevronRight
} from "lucide-react";
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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 640) {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }

    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    try {
      logout();
    } finally {
      navigate("/");
    }
  };

  const mobileNavItems = useMemo(() => {
    const items = [];

    if (isAuthenticated) {
      items.push(
        { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { key: "create-quiz", label: "Create Quiz", href: "/create-quiz", icon: PlusCircle },
        { key: "join-quiz", label: "Join Quiz", href: "/join-quiz", icon: LogIn },
        { key: "my-performance", label: "My Performance", href: "/my-performance", icon: BarChart3 },
        { key: "profile", label: "Profile", href: "/profile", icon: User },
      );
    } else {
      items.push(
        { key: "login", label: "Login", href: "/login", icon: LogIn },
        { key: "register", label: "Register", href: "/register", icon: User },
      );
    }

    return items;
  }, [isAuthenticated]);

  const mobileMenuActions = useMemo(() => {
    const actions = [];

    if (isAuthenticated) {
      actions.push(
        { key: "logout", label: "Logout", onClick: handleLogout, isLogout: true, icon: LogOut }
      );
    }

    return actions;
  }, [isAuthenticated]);

  const handleMobileNavClick = (href) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-md transition-colors",
        className,
      ].join(" ")}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-center sm:justify-between px-4 sm:px-6 lg:px-8">
        <div className="absolute left-4 sm:static flex items-center gap-3">
          <button
            ref={mobileMenuButtonRef}
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-800/50 text-slate-300 transition hover:bg-slate-700 hover:text-white sm:hidden"
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
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(isAuthenticated ? "/profile" : "/")}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Branding size="w-9 h-9" />
            <span className="hidden text-sm font-semibold text-white md:block lg:hidden">
              {routeLabel}
            </span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-1" role="navigation" aria-label="Desktop navigation">
          <ul className="flex items-center gap-0.5" role="list">
            {mobileNavItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href));
              return (
                <li key={item.key} role="none">
                  <button
                    type="button"
                    onClick={() => handleMobileNavClick(item.href)}
                    className={[
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-indigo-600/20 text-indigo-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                    role="menuitem"
                  >
                    <item.icon className="h-4 w-4" />
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
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                    action.isLogout
                      ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  ].join(" ")}
                  role="menuitem"
                >
                  <action.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{action.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMounted && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              id="mobile-menu"
              className="fixed inset-0 z-[9999] sm:hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              />

              <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                exit={{ x: -100 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute left-0 top-0 z-[9999] h-full w-72 max-w-[85%]"
                aria-hidden="true"
              >
                <div className="flex h-full flex-col bg-slate-900 border-r border-slate-700 shadow-2xl">
                  <div className="flex h-14 items-center justify-between border-b border-slate-700/50 px-4 shrink-0">
                    <span className="text-sm font-semibold text-white">Menu</span>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label="Close menu"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <nav className="flex flex-1 flex-col overflow-y-auto p-3" role="navigation" aria-label="Mobile navigation">
                    <ul className="space-y-1" role="list">
                      {mobileNavItems.map((item, index) => {
                        const isActive = location.pathname === item.href ||
                          (item.href !== "/" && location.pathname.startsWith(item.href));
                        return (
                          <li key={item.key} role="none">
                            <motion.button
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              type="button"
                              onClick={() => handleMobileNavClick(item.href)}
                              className={[
                                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 min-h-[44px]",
                                isActive
                                  ? "bg-indigo-600/20 text-indigo-400"
                                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
                              ].join(" ")}
                              aria-current={isActive ? "page" : undefined}
                              role="menuitem"
                            >
                              <item.icon className="h-4 w-4" />
                              <span className="flex-1">{item.label}</span>
                              <ChevronRight className="h-4 w-4 text-slate-600" />
                            </motion.button>
                          </li>
                        );
                      })}
                      {mobileMenuActions.map((action, index) => (
                        <li key={action.key} role="none">
                          <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: mobileNavItems.length * 0.05 }}
                            type="button"
                            onClick={action.onClick}
                            className={[
                              "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 min-h-[44px]",
                              action.isLogout
                                ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white",
                            ].join(" ")}
                            role="menuitem"
                          >
                            <action.icon className="h-4 w-4" />
                            <span className="flex-1">{action.label}</span>
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                          </motion.button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}

export default Navbar;


