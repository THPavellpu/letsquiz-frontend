import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

import { loginUser, resendVerification } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Branding from "../../components/layout/Branding";

// Feature flag for Google Login (not implemented yet)
const ENABLE_GOOGLE_LOGIN = false;

// Custom icons
const WarningIcon = () => (
  <svg
    className="h-5 w-5 flex-shrink-0"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="h-5 w-5 flex-shrink-0"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email verification state
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validation = useMemo(() => {
    const errors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    const isValid = !errors.email && !errors.password;

    return { ...errors, isValid };
  }, [email, password]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await resendVerification({ email });
      setResendSuccess(true);
    } catch (error) {
      // Even if error, show success message for security
      setResendSuccess(true);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setShowVerificationPrompt(false);
    setResendSuccess(false);

    if (!validation.isValid) return;

    setIsSubmitting(true);
    try {
      const response = await loginUser({
        email,
        password,
      });

      // Do not modify authentication logic
      login(response.data.access, response.data.refresh);
      navigate("/dashboard");
    } catch (error) {
      const responseData = error?.response?.data;
      const errorCode = responseData?.code;
      const status = error?.response?.status;

      // Handle specific error codes from backend
      if (errorCode === "EMAIL_NOT_VERIFIED") {
        setShowVerificationPrompt(true);
        setFormError("");
      } else if (errorCode === "INVALID_CREDENTIALS") {
        setFormError("Invalid email or password.");
        setShowVerificationPrompt(false);
      } else if (!error.response) {
        // Network failure
        setFormError(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else if (status === 500) {
        setFormError(
          "Something went wrong on our end. Please try again later."
        );
      } else if (status >= 500) {
        setFormError(
          "Server error. Please try again later."
        );
      } else if (error.code === "ECONNABORTED") {
        setFormError(
          "The request timed out. Please try again."
        );
      } else {
        setFormError(
          "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full"
        >
          <Card className="shadow-lg" padding="lg">
            <motion.div
              initial={{ scale: 0.99 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.25 }}
              className="mx-auto w-full max-w-md"
            >
              <div className="mb-6 flex flex-col items-center justify-center gap-4 text-center">
                <Branding size="w-16 h-16" />

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                    Welcome Back
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Sign in to continue to <span className="font-medium">LetsQuiz</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={validation.email || undefined}
                  autoComplete="email"
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={validation.password || undefined}
                    className="w-full pr-20 text-base"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Email Not Verified Warning Card */}
                <AnimatePresence mode="wait">
                  {showVerificationPrompt && !resendSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
                          <WarningIcon />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                            Email not verified
                          </h3>
                          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                            Your email address hasn't been verified yet.
                          </p>
                          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                            Please check your Inbox and Spam folder and click the verification link before logging in.
                          </p>
                          <div className="mt-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleResendVerification}
                              disabled={isResending}
                              className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900/30"
                            >
                              {isResending ? (
                                <span className="inline-flex items-center gap-2">
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500/40 border-t-amber-500" />
                                  <span>Sending...</span>
                                </span>
                              ) : (
                                "Resend Verification Email"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Resend Success Message */}
                <AnimatePresence mode="wait">
                  {resendSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                          <CheckIcon />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                            Verification email sent successfully.
                          </h3>
                          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                            Please check your Inbox and Spam folder.
                          </p>
                          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                            If you have already verified your email, refresh the page and log in again.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Error */}
                <AnimatePresence mode="wait">
                  {formError && !showVerificationPrompt && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
                    >
                      {formError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  className="mt-2 w-full text-base"
                  isLoading={isSubmitting}
                  loadingText="Signing in..."
                  disabled={!validation.isValid || isSubmitting}
                >
                  Login
                </Button>

                {ENABLE_GOOGLE_LOGIN && (
                  <>
                    <div className="py-2">
                      <div className="flex items-center">
                        <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
                        <div className="mx-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                          ---------------- OR ----------------
                        </div>
                        <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:text-slate-100"
                      onClick={() => {
                        // UI-only: keep existing functionality unchanged
                      }}
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">G</span>
                      Continue with Google
                    </button>
                  </>
                )}

                <div className="pt-2 text-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Don't have an account?</span>
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Create one
                  </button>
                </div>
              </form>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;