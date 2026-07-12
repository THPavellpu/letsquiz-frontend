import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";

import { registerUser } from "../../api/authApi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Branding from "../../components/layout/Branding";

const ENABLE_GOOGLE_LOGIN = false;

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validation = useMemo(() => {
    const errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!username.trim()) {
      errors.username = "Full name is required.";
    } else if (username.trim().length < 3) {
      errors.username = "Full name must be at least 3 characters.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    const isValid =
      !errors.username && !errors.email && !errors.password && !errors.confirmPassword;

    return { ...errors, isValid };
  }, [username, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!validation.isValid) return;

    setIsSubmitting(true);
    try {
      // Generate backend-friendly username from Full Name
      // Rules: trim spaces, replace spaces with "_", lowercase, remove invalid chars
      // Allowed: letters, numbers, _, ., +, -, @
      const usernameFromFullName = username
        .trim()
        .replace(/\s+/g, "_")
        .toLowerCase()
        .replace(/[^a-z0-9_.+\-@]/g, "");

      const payload = {
        username: usernameFromFullName,
        email,
        password,
      };

      ///console.log("REGISTER PAYLOAD", payload);

      const response = await registerUser(payload);

      console.log("REGISTER SUCCESS", response);

      setMessage(
        "Registration successful. Please check your email to verify your LetsQuiz account."
      );

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log("REGISTER ERROR", error);
      console.log("STATUS", error.response?.status);
      console.log("DATA", error.response?.data);

      // Prefer backend-provided validation/detail message
      const backendData = error?.response?.data;
      const backendMessage =
        backendData?.detail ||
        backendData?.message ||
        (typeof backendData === "string" ? backendData : "") ||
        "";

      if (backendMessage) {
        setError(backendMessage);
      } else if (backendData) {
        // Handle Django-style field errors: { field: ["msg"] }
        if (typeof backendData === "object") {
          const parts = [];
          for (const [key, val] of Object.entries(backendData)) {
            if (Array.isArray(val)) {
              parts.push(`${key}: ${val.join(", ")}`);
            } else if (typeof val === "string") {
              parts.push(`${key}: ${val}`);
            }
          }
          setError(parts.length ? parts.join("\n") : "Registration failed.");
        } else {
          setError("Registration failed.");
        }
      } else {
        setError("Server error.");
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
                    Create your account
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Join LetsQuiz and start creating quizzes.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Full name"
                  type="text"
                  placeholder="Enter full name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={validation.username || undefined}
                  className="text-base"
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={validation.email || undefined}
                  className="text-base"
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
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    <span className="text-sm font-medium">{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={validation.confirmPassword || undefined}
                    className="w-full pr-20 text-base"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    aria-pressed={showConfirmPassword}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    <span className="text-sm font-medium">{showConfirmPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>

                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
                    role="alert"
                    aria-live="assertive"
                  >
                    {error}
                  </motion.div>
                ) : null}

                {message ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    role="status"
                    aria-live="polite"
                  >
                    {message}
                  </motion.div>
                ) : null}

                <Button
                  type="submit"
                  className="mt-2 w-full text-base"
                  isLoading={isSubmitting}
                  disabled={!validation.isValid || isSubmitting}
                >
                  Create Account
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
                  <span className="text-xs text-gray-500 dark:text-gray-400">Already have an account?</span>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Sign in
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

export default Register;



