import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


function Sidebar({
  className = "",
  items = [],
  title = "Menu",
  mobileOpen = false,
  onMobileClose,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && onMobileClose) onMobileClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onMobileClose]);

  const sidebar = (
    <aside
      className={[
        "h-full w-64 shrink-0 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900",
        className,
      ].join(" ")}
    >
      <div className="pt-6 px-4">
        {/* Branding removed from sidebar; keep navigation only */}
      </div>


      <nav className="px-2 pb-4">
        {items.length ? (
          <ul className="space-y-1 px-1">

            {items.map((item) => {
              const href = item.href ?? "#";
              const active = item.active ?? (href !== "#" && location.pathname.startsWith(href));
              return (
                <li key={item.key ?? item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!href || href === "#") return;
                      navigate(href);
                      if (onMobileClose) onMobileClose();
                    }}
                    className={[
                      "w-full rounded-xl px-3 py-2 text-left text-sm transition-colors",
                      active
                        ? "bg-slate-800 text-white dark:bg-slate-800"
                        : "hover:bg-slate-800 text-slate-300 dark:text-slate-300 dark:hover:bg-slate-800",
                    ].join(" ")}

                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-3 text-sm text-slate-400">No items</div>
        )}
      </nav>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden h-full sm:block">{sidebar}</div>

      {/* Mobile overlay */}
      <div
        className={[
          "fixed inset-0 z-40 sm:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        <div
          className={[
            "absolute inset-0 bg-black/40 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => onMobileClose?.()}
        />
        <div
          className={[
            "absolute left-0 top-0 h-full transform transition-transform",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          {sidebar}
        </div>
      </div>
    </>
  );
}

export default Sidebar;


