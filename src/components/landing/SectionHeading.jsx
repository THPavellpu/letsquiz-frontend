import React from "react";

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}) {
  const alignment =
    align === "left" ? "md:text-left" : align === "right" ? "md:text-right" : "";

  return (
    <div className={["space-y-3", alignment].join(" ")}>
      {eyebrow ? (
        <div className="text-xs font-semibold tracking-wider text-indigo-300/90">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm leading-relaxed text-white/70 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeading;

