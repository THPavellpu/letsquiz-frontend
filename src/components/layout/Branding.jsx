import logo from "../../assets/letsquiz logo.png";

function Branding({
  size = "w-12 h-12",
  titleClassName = "text-base font-semibold",
  subtitleClassName = "text-xs text-gray-600 dark:text-gray-300",
  wrapperClassName = "",
}) {
  return (
    <div className={["flex items-center gap-3", wrapperClassName].join(" ")}>
      {/* Do NOT add background behind the logo. Keep transparent. */}
      <img
        src={logo}
        alt="LetsQuiz logo"
        className={["object-contain", size].join(" ")}
      />

      <div className="leading-tight">
        <div
          className={[
            "text-gray-900 dark:text-white",
            titleClassName,
          ].join(" ")}
        >
          LetsQuiz
        </div>
        <div className={subtitleClassName}>Create. Challenge. Learn.</div>
      </div>
    </div>
  );
}

// propTypes intentionally omitted to avoid extra dependencies in build.

export default Branding;

