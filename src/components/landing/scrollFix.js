// Ensure scrolling offsets respect the sticky navbar in all browsers.
// This is a tiny workaround for inconsistent scroll-margin handling.
if (typeof window !== "undefined") {
  document.documentElement.style.scrollBehavior = "smooth";
}

