import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Branding from "../../components/layout/Branding";

// Feature flag for Google Login (not implemented yet)
const ENABLE_GOOGLE_LOGIN = false;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validation.isValid) return;

    setIsSubmitting(true);
    try {
      const response = await loginUser({
        email,
        password,
      });

      // Do not modify authentication logic
      login(response.data.access, response.data.refresh);
      navigate("/profile");
    } catch (error) {
      // Keep existing behavior (log server error), but also show a user-friendly message
      if (error?.response?.data) console.log(error.response.data);
      setFormError("Login failed. Please check your credentials and try again.");
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

                {formError ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
                  >
                    {formError}
                  </motion.div>
                ) : null}

                <Button
                  type="submit"
                  className="mt-2 w-full text-base"
                  isLoading={isSubmitting}
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



