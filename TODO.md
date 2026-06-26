# TODO - Login password field UI fix

- [ ] Inspect current `src/pages/auth/Login.jsx` password field layout and validation rendering
- [ ] Refactor password section:
  - [ ] Keep password input full width
  - [ ] Wrap input + show/hide button in a `relative` container
  - [ ] Move show/hide button to absolute right side using `absolute right-4 top-1/2 -translate-y-1/2`
  - [ ] Move “Forgot password?” link below the password input and right-align it
- [ ] Adjust error rendering so validation and server errors appear below input/link without overlap
- [ ] Maintain dark mode styling and add spacing between label, input, error, forgot link, and login button
- [ ] Verify layout on desktop and mobile by running the dev server

