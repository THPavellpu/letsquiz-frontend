import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import { forgotPassword } from "../../api/authApi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Branding from "../../components/layout/Branding";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validation = useMemo(() => {
    const errors = {
      email: "",
    };

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    const isValid = !errors.email;

    return { ...errors, isValid };
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!validation.isValid) return;

    setIsSubmitting(true);
    try {
      const response = await forgotPassword({ email });

      console.log("FORGOT PASSWORD SUCCESS", response);

      setMessage(
        "If an account with this email exists, a password reset link has been sent."
      );

      setEmail("");

      // Optionally redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.log("FORGOT PASSWORD ERROR", err);
      console.log("STATUS", err.response?.status);
      console.log("DATA", err.response?.data);

      // For security reasons, always show a generic success message
      // even if the email doesn't exist (prevents email enumeration)
      setMessage(
        "If an account with this email exists, a password reset link has been sent."
      );
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
                    Reset Password
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={validation.email || undefined}
                />

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
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="pt-2 text-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Remember your password?
                  </span>
                  <Link
                    to="/login"
                    className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {" "}Sign in
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

export default ForgotPassword;