import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function PageContainer({ className = "", children, maxWidth = "7xl" }) {
  const { isAuthenticated } = useAuth();

  const navItems = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { key: "login", label: "Login", href: "/login" },
        { key: "register", label: "Register", href: "/register" },
      ];
    }

    return [
      { key: "dashboard", label: "Dashboard", href: "/dashboard" },
      { key: "create-quiz", label: "Create Quiz", href: "/create-quiz" },
      { key: "join-quiz", label: "Join Quiz", href: "/join-quiz" },
      { key: "my-quizzes", label: "My Quizzes", href: "/my-quizzes" },
      { key: "my-performance", label: "My Performance", href: "/my-performance" },
      { key: "profile", label: "Profile", href: "/profile" },
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
        {/* Desktop Sidebar Only - Mobile navigation is handled by Navbar */}
        <div className="hidden sm:block">
          <Sidebar title="LetsQuiz" items={navItems} />
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
      </div>
    </div>
  );
}

export default PageContainer;


