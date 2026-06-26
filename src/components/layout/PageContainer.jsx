import React, { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function PageContainer({ className = "", children, maxWidth = "7xl" }) {
  const { isAuthenticated } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { key: "login", label: "Login", href: "/login" },
        { key: "register", label: "Register", href: "/register" },
      ];
    }

    return [
      { key: "profile", label: "Profile", href: "/profile" },
      { key: "dashboard", label: "Dashboard", href: "/dashboard" },
      { key: "my-performance", label: "My Performance", href: "/my-performance" },
      { key: "create-quiz", label: "Create Quiz", href: "/create-quiz" },
      { key: "join-quiz", label: "Join Quiz", href: "/join-quiz" },
      { key: "leaderboards", label: "Leaderboards", href: "/leaderboards" },
    ];
  }, [isAuthenticated]);

  return (
    <div
      className={[
        "min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100",
        className,
      ].join(" ")}
    >
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl">
        {/* Sidebar */}
        <div className="hidden sm:block">
          <Sidebar title="LetsQuiz" items={navItems} />
        </div>

        {/* Mobile sidebar toggle */}
        <div className="sm:hidden">
          <div className="sr-only">Mobile layout</div>
          <button
            type="button"
            className="sr-only"
            onClick={() => setMobileSidebarOpen(true)}
          />
        </div>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div
            className={`w-full px-4 py-6 sm:px-6 lg:px-8`}
            style={{ maxWidth: maxWidth === "7xl" ? undefined : undefined }}
          >
            {/* Page transitions */}
            <div className="animate-[fadeIn_180ms_ease-out]">{children}</div>

          </div>

          <Footer />
        </main>

        {/* Mobile overlay sidebar */}
        <div className="sm:hidden">
          <Sidebar
            title="LetsQuiz"
            items={navItems}
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default PageContainer;


