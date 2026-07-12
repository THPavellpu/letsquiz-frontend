import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { joinQuiz } from "../../api/quizApi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

function JoinQuiz() {
    const [quizCode, setQuizCode] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        try {
            const response = await joinQuiz({
                quiz_code: quizCode,
            });

            navigate(`/quiz/${response.data.attempt_id}`);
        } catch (err) {
            const message = err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                err;

            // Never display raw JSON objects to users
            const normalized = typeof message === "string" ? message.toLowerCase() : "";
            if (
                typeof message === "string" &&
                (normalized.includes("joining deadline passed") ||
                  normalized.includes("join deadline passed") ||
                  normalized.includes("quiz closed"))
            ) {
                setError(
                    "⚠ Quiz Closed\nThis quiz is no longer accepting participants because the join deadline has passed."
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
        <div className="flex w-full flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Join Quiz</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Enter the quiz code shared by the creator.
                    </p>
                </div>

                <Card
                    className="mt-6 max-w-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-xl"
                    padding="none"
                    bordered={false}
                    shadow={false}
                >
                    {error ? (
                        <div
                            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-200"
                            role="alert"
                        >
                            {error}
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                                Quiz Code
                            </label>

                            <Input
                                value={quizCode}
                                onChange={(e) => setQuizCode(e.target.value)}
                                placeholder="Enter quiz code"
                                className="h-12 rounded-xl bg-white dark:bg-gray-900"
                                inputClassName=""
                                type="text"
                                disabled={isSubmitting}
                                autoComplete="off"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="h-12 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-lg"
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            Join Quiz
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                        Need a quiz code? Ask your teacher or quiz creator for the code.
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default JoinQuiz;


