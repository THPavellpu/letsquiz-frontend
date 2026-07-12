import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Branding from "../layout/Branding";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Ensure smooth-scroll works even if some browsers don't honor CSS alone.
import "./scrollFix";


function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function NavLink({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-medium text-white/80 transition hover:text-white"
    >
      {label}
    </button>
  );
}

function LandingNavbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";

    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!mobileOpen) return;
      if (!mobileMenuRef.current) return;
      if (mobileMenuRef.current.contains(e.target)) return;
      setMobileOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [mobileOpen]);

  const navItems = useMemo(
    () => [
      { key: "home", label: "Home", onClick: () => scrollToId("top") },
      { key: "features", label: "Features", onClick: () => scrollToId("features") },
      { key: "how", label: "How It Works", onClick: () => scrollToId("how-it-works") },
      { key: "educators", label: "For Educators", onClick: () => scrollToId("educators") },
      { key: "pricing", label: "Pricing", badge: "Coming Soon" },
      { key: "faq", label: "FAQ", onClick: () => scrollToId("faq") },
    ],
    []
  );

  const handlePricing = () => {
    scrollToId("cta");
  };

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full",
        "border-b border-white/10",
        "transition-all duration-300",
        scrolled
          ? "bg-slate-950/70 backdrop-blur"
          : "bg-slate-950/10 backdrop-blur-md",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (reduceMotion) {
                window.scrollTo(0, 0);
              } else {
                scrollToId("top");
              }
            }}
            className="rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Go to top"
          >
            <Branding size="w-12 h-12" />
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {navItems.map((item) => {
            if (item.key === "pricing") {
              return (
                <div key={item.key} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePricing}
                    className="text-sm font-medium text-white/80 transition hover:text-white"
                  >
                    {item.label}
                  </button>
                  <span className="rounded-full border border-indigo-300/30 bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-200">
                    {item.badge}
                  </span>
                </div>
              );
            }

            return <NavLink key={item.key} label={item.label} onClick={item.onClick} />;
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(99,102,241,0.35)] transition hover:brightness-110"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 p-2 text-white md:hidden"
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="landing-mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        ref={mobileMenuRef}
        id="landing-mobile-nav"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="md:hidden overflow-hidden border-t border-white/10 bg-slate-950/95"
      >
        <nav className="mx-auto max-w-7xl px-4 py-4" aria-label="Mobile primary">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const onClick = () => {
                setMobileOpen(false);
                if (item.key === "pricing") return handlePricing();
                item.onClick?.();
              };

              if (item.key === "pricing") {
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={onClick}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left min-h-[48px]"
                  >
                    <span className="text-sm font-semibold text-white/90">{item.label}</span>
                    <span className="rounded-full border border-indigo-300/30 bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-200">
                      {item.badge}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    item.onClick?.();
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left min-h-[48px]"
                >
                  <span className="text-sm font-semibold text-white/90">{item.label}</span>
                </button>
              );
            })}

            <div className="mt-3 h-px bg-white/10" />

            {isAuthenticated ? (
                <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/dashboard");
                }}
                className="rounded-xl border border-white/10 bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-left text-sm font-semibold text-white min-h-[48px]"
              >
                Go to Dashboard
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/login");
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white/90 min-h-[48px]"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/register");
                  }}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-left text-sm font-semibold text-white min-h-[48px]"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </nav>
      </motion.div>
    </header>
  );
}

export default LandingNavbar;

