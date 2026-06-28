// Small helper to generate a CSS-based ripple effect when used with buttons.
export function applyRippleEffect(e) {
  const button = e.currentTarget;
  if (!button) return;

  const ripple = document.createElement("span");
  ripple.className = "landing-ripple";

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

  const existing = button.getElementsByClassName("landing-ripple");
  for (const el of existing) el.remove();

  button.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 650);
}

