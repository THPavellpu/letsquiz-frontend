import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, AlertCircle, Key } from "lucide-react";

import { joinQuiz } from "../../api/quizApi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import SectionHeader from "../../components/ui/SectionHeader";

function JoinQuiz() {
    const [quizCode, setQuizCode] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (isSubmitting || !quizCode.trim()) return;

        setError("");
        setIsSubmitting(true);

        try {
            const response = await joinQuiz({
                quiz_code: quizCode.trim(),
            });

            navigate(`/quiz/${response.data.attempt_id}`);
        } catch (err) {
            const message = err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                err;

            const normalized = typeof message === "string" ? message.toLowerCase() : "";
            if (
                typeof message === "string" &&
                (normalized.includes("joining deadline passed") ||
                  normalized.includes("join deadline passed") ||
                  normalized.includes("quiz closed"))
            ) {
                setError(
                    "This quiz is no longer accepting participants because the join deadline has passed."
                );
            } else if (typeof message === "string") {
                setError(message);
            } else {
                setError("Unable to join quiz. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <SectionHeader
                title="Join Quiz"
                description="Enter the quiz code shared by the creator to participate."
                icon={LogIn}
                className="mb-6"
            />

            <Card padding="lg" className="border border-slate-700/50">
                {error ? (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4"
                        role="alert"
                    >
                        <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-300">{error}</p>
                    </motion.div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Quiz Code"
                        value={quizCode}
                        onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                        placeholder="e.g. ABC123"
                        type="text"
                        disabled={isSubmitting}
                        autoComplete="off"
                        icon={Key}
                        className="text-center tracking-widest text-lg font-mono"
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        isLoading={isSubmitting}
                        disabled={isSubmitting || !quizCode.trim()}
                        icon={LogIn}
                    >
                        Join Quiz
                    </Button>
                </form>

                <div className="mt-5 pt-5 border-t border-slate-700/50">
                    <p className="text-xs text-center text-slate-500">
                        Don't have a quiz code? Ask your teacher or quiz creator to share one with you.
                    </p>
                </div>
            </Card>
        </div>
    );
}

export default JoinQuiz;


