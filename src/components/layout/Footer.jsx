import React from "react";

function Footer({ className = "" }) {
  return (
    <footer
      className={[
        "border-t border-slate-700/50 bg-slate-900/50",
        className,
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>© {new Date().getFullYear()} LetsQuiz</div>
        <div className="hidden sm:block">Create. Challenge. Learn.</div>
      </div>
    </footer>
  );
}

export default Footer;


