import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, LogIn } from "lucide-react";

import { loginUser, resendVerification } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Branding from "../../components/layout/Branding";

const ENABLE_GOOGLE_LOGIN = false;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validation = useMemo(() => {
    const errors = { email: "", password: "" };

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
      const response = await loginUser({ email, password });
      login(response.data.access, response.data.refresh);
      navigate("/profile");
    } catch (error) {
      const responseData = error?.response?.data;
      const errorCode = responseData?.code;
      const status = error?.response?.status;

      if (errorCode === "EMAIL_NOT_VERIFIED") {
        setShowVerificationPrompt(true);
        setFormError("");
      } else if (errorCode === "INVALID_CREDENTIALS") {
        setFormError("Invalid email or password.");
        setShowVerificationPrompt(false);
      } else if (!error.response) {
        setFormError("Unable to connect to the server. Please check your internet connection and try again.");
      } else if (status === 500) {
        setFormError("Something went wrong on our end. Please try again later.");
      } else if (status >= 500) {
        setFormError("Server error. Please try again later.");
      } else if (error.code === "ECONNABORTED") {
        setFormError("The request timed out. Please try again.");
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="w-full">
          <Card className="shadow-2xl" padding="lg">
            <motion.div initial={{ scale: 0.99 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }} className="mx-auto w-full max-w-md">
              <div className="mb-6 flex flex-col items-center justify-center gap-4 text-center">
                <Branding size="w-14 h-14" />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
                  <p className="mt-2 text-sm text-slate-400">Sign in to continue to <span className="font-medium text-indigo-400">LetsQuiz</span></p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Email" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} error={validation.email || undefined} autoComplete="email" icon={Mail} />

                <div className="relative">
                  <Input label="Password" type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} error={validation.password || undefined} autoComplete="current-password" icon={Lock} />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <AnimatePresence mode="wait">
                  {showVerificationPrompt && !resendSuccess && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4" role="status" aria-live="polite">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-amber-300">Email not verified</h3>
                          <p className="mt-1 text-xs text-amber-400/80">Please check your Inbox and Spam folder and click the verification link before logging in.</p>
                          <div className="mt-3">
                            <Button type="button" variant="outline" size="sm" onClick={handleResendVerification} disabled={isResending} className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
                              {isResending ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border border-amber-500/30 border-t-amber-400" />Sending...</span> : "Resend Verification Email"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {resendSuccess && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4" role="status" aria-live="polite">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-emerald-300">Verification email sent</h3>
                          <p className="mt-1 text-xs text-emerald-400/80">Please check your Inbox and Spam folder. If you have already verified, refresh and log in again.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {formError && !showVerificationPrompt && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert" aria-live="assertive">
                      {formError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button type="submit" className="w-full" isLoading={isSubmitting} loadingText="Signing in..." disabled={!validation.isValid || isSubmitting} icon={LogIn}>
                  Sign In
                </Button>

                {ENABLE_GOOGLE_LOGIN && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-700" />
                      <span className="text-xs text-slate-500">or</span>
                      <div className="flex-1 h-px bg-slate-700" />
                    </div>
                    <button type="button" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-white text-slate-900 text-xs font-bold">G</span>
                      Continue with Google
                    </button>
                  </>
                )}

                <div className="text-center pt-2">
                  <span className="text-xs text-slate-500">Don't have an account?</span>
                  <button type="button" onClick={() => navigate("/register")} className="text-xs font-medium text-indigo-400 hover:text-indigo-300 ml-1 transition-colors">
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