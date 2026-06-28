# Mobile-first responsive improvements (LetsQuiz)

## Step 1 — Shared touch targets & focus/disabled states
- [x] Update `src/components/ui/Button.jsx` to ensure min 48px tap height (sm/md/lg).
- [ ] Update `src/components/ui/Input.jsx` for larger input height + error text sizing/spacing.
- [ ] Optionally adjust `src/components/ui/Card.jsx` padding defaults if needed.

## Step 2 — Mobile navigation improvements
- [ ] `src/components/landing/LandingNavbar.jsx`: add body scroll lock when menu is open; ensure menu item min height 48px; improve stable open/close animation.
- [ ] `src/components/layout/Navbar.jsx`: add body scroll lock when mobile menu/profile panel is open; ensure menu items min height 48px; smoother animation.

## Step 3 — Landing hero & footer readability
- [ ] `src/components/landing/Hero.jsx`: enforce mobile stacking, reduce vertical spacing, ensure image placement below text.
- [ ] `src/components/landing/LandingFooter.jsx`: stack columns on mobile, larger social icons, larger newsletter input + subscribe button.
- [ ] Audit all landing sections for 1-card-per-row and consistent spacing.

## Step 4 — Forms (login/register/forgot/reset)
- [ ] `src/pages/auth/Login.jsx`: enlarge password visibility toggle tap target; ensure spacing + error placement.
- [ ] `src/pages/auth/Register.jsx`: enlarge both password toggles; ensure consistent input/button sizing.
- [ ] `src/pages/auth/ForgotPassword.jsx`: ensure input/button tap targets are compliant.
- [ ] `src/pages/auth/ResetPassword.jsx`: enlarge both password toggles; ensure error message sizing.

## Step 5 — Quiz interface (highest priority)
- [ ] `src/pages/player/QuizPage.jsx`: improve readability (font sizes/line-height), increase spacing between options (16–20px), make option cards safer for accidental taps.
- [ ] Implement fixed bottom action area on mobile when appropriate (Submit/Next) + ensure content not hidden behind it.
- [ ] Increase prominence/clarity of timer + progress indicator.
- [ ] Audit `src/pages/participant/QuizPage.jsx` for same fixes.

## Step 6 — Dashboard / Leaderboard / Tables
- [ ] `src/pages/player/LeaderboardPage.jsx`: verify mobile cards spacing/tap targets + current user highlight + badges.
- [ ] `src/pages/creator/Dashboard.jsx` and `src/pages/creator/Analytics.jsx`: ensure mobile card stacking; responsive charts/tables (no horizontal scroll).

## Step 7 — Accessibility & performance
- [ ] Ensure focus-visible outlines exist for keyboard users across updated components.
- [ ] Add ARIA labels for menus where applicable.
- [ ] Respect reduced motion for nav/menu animations.

## Step 8 — Responsive audit
- [ ] Run through all pages and verify: no horizontal scroll, no clipped text, touch targets >=48px, no tiny fonts.

## Verification
- [ ] Chrome Mobile / Android Chrome
- [ ] iPhone Safari
- [ ] Safari Mobile
- [ ] Desktop layout remains unchanged.

