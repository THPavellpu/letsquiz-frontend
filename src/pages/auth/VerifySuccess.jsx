import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Branding from "../../components/layout/Branding";

function VerifySuccess() {
  const navigate = useNavigate();

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
              {/* Success Icon */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg
                    className="h-10 w-10 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
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
                Email Verified Successfully!
              </h1>

              {/* Text */}
              <p className="mb-8 text-sm text-gray-600 dark:text-gray-300">
                Your LetsQuiz account has been verified. You can now log in and start creating or attempting quizzes.
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
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

export default VerifySuccess;