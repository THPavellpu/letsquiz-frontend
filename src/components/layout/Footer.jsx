import React from "react";

function Footer({ className = "" }) {
  return (
    <footer
      className={[
        "border-t border-gray-200 bg-white transition-colors dark:border-gray-700 dark:bg-gray-900",
        className,
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-gray-600 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>© {new Date().getFullYear()} LetsQuiz</div>
        <div className="text-gray-500 dark:text-gray-400">Create. Challenge. Learn.</div>
      </div>
    </footer>
  );
}

export default Footer;


