import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";

import { resetPassword } from "../../api/authApi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Branding from "../../components/layout/Branding";

function ResetPassword() {
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validation = useMemo(() => {
    const errors = {
      password: "",
      confirmPassword: "",
    };

    // Password requirements
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
    }

    // Confirm password
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    const isValid = !errors.password && !errors.confirmPassword;

    return { ...errors, isValid };
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!validation.isValid) return;

    setIsSubmitting(true);
    try {
      const response = await resetPassword(uid, token, {
        password,
      });

      console.log("RESET PASSWORD SUCCESS", response);

      setMessage("Your password has been reset successfully.");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.log("RESET PASSWORD ERROR", err);
      console.log("STATUS", err.response?.status);
      console.log("DATA", err.response?.data);

      const backendData = err?.response?.data;
      const backendMessage =
        backendData?.detail ||
        backendData?.message ||
        (typeof backendData === "string" ? backendData : "") ||
        "";

      if (err.response?.status === 400) {
        setError(backendMessage || "Invalid request. Please try again.");
      } else if (err.response?.status === 404) {
        setError("Invalid or expired reset link. Please request a new one.");
      } else if (err.response?.status === 401) {
        setError("This reset link has expired. Please request a new one.");
      } else {
        setError("Failed to reset password. Please try again.");
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
                    New Password
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Enter your new password below.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
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

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={validation.confirmPassword || undefined}
                    className="w-full pr-20 text-base"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
                  >
                    {error}
                  </motion.div>
                ) : null}

                {message ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
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
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default ResetPassword;