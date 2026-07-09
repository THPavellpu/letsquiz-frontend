import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function PageContainer({ className = "", children, maxWidth = "7xl" }) {
  return (
    <div
      className={[
        "min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100",
        className,
      ].join(" ")}
    >
      <Navbar />

      {/* Main content - full width */}
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
  );
}

export default PageContainer;


