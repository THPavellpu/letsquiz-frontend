import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Branding from "../../components/layout/Branding";

const REASON_MESSAGES = {
  expired: {
    title: "Verification Link Expired",
    description: "Your verification link has expired. Please request a new verification email.",
  },
  invalid: {
    title: "Invalid Verification Link",
    description: "The verification link is invalid. Please check your email for the correct link.",
  },
  already_verified: {
    title: "Email Already Verified",
    description: "Your email has already been verified. You can now log in to your account.",
  },
};

function VerifyFailed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const reason = searchParams.get("reason") || "invalid";
  const messageData = REASON_MESSAGES[reason] || REASON_MESSAGES.invalid;

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
              className="mx-auto w-full max-w-md text-center"
            >
              {/* Error Icon */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <svg
                    className="h-10 w-10 text-red-600 dark:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>

              {/* Branding */}
              <div className="mb-6 flex justify-center">
                <Branding size="w-12 h-12" />
              </div>

              {/* Heading */}
              <h1 className="mb-3 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                {messageData.title}
              </h1>

              {/* Text */}
              <p className="mb-8 text-sm text-gray-600 dark:text-gray-300">
                {messageData.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={() => navigate("/login")}>
                  Go to Login
                </Button>
                <Button variant="outline" onClick={() => {
                  // Placeholder for resend verification - can be connected to API later
                  console.log("Resend verification clicked");
                }}>
                  Resend Verification Email
                </Button>
                <Button variant="ghost" onClick={() => navigate("/")}>
                  Go Home
                </Button>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default VerifyFailed;