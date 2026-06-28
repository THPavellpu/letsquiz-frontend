# TODO - LetsQuiz routing update

- [ ] Gather routing/auth behavior in current code (App routes, AuthContext, ProtectedRoute) 
- [ ] Update `src/App.jsx` routes to:
  - [ ] Serve LandingPage on `/` when not authenticated
  - [ ] Redirect authenticated users from `/` to `/dashboard`
  - [ ] Keep `/login` and `/register` accessible for unauthenticated users
  - [ ] Ensure logout behavior redirects to `/` (only adjust routing/navigation)
  - [ ] Ensure direct URL refresh works in production (Vercel history fallback)
- [ ] Ensure LandingPage contains required sections (Hero/Features/How it Works/Educators/Statistics/CTA/Footer)
- [ ] Ensure Navbar buttons route to correct pages (/login, /register, /register for Get Started Free)
- [ ] Confirm no changes to existing JWT/auth logic and `ProtectedRoute`
- [ ] Add/adjust a catch-all route (optional) for robustness
- [ ] Run dev build/lint/test and verify routing locally
- [ ] Validate Vercel config for SPA routing

