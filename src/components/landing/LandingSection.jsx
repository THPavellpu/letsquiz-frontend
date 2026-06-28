import React from "react";

function LandingSection({ id, className = "", children }) {
  return (
    <section id={id} className={["relative scroll-mt-24", className].join(" ")}>
      {children}
    </section>
  );
}

export default LandingSection;

