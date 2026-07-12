import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function PageContainer({
  className = "",
  children,
  maxWidth = "7xl",
  showNavbar = true,
  showFooter = true,
}) {
  return (
    <div
      className={[
        "min-h-screen bg-slate-950 text-slate-100 transition-colors duration-300",
        className,
      ].join(" ")}
    >
      {showNavbar && <Navbar />}

      <main className="min-w-0 flex-1">
        <div
          className="w-full px-5 py-6 sm:px-8 lg:px-10"
        >
          <div className="animate-[fadeIn_180ms_ease-out]">{children}</div>
        </div>

        {showFooter && <Footer />}
      </main>
    </div>
  );
}

export default PageContainer;


