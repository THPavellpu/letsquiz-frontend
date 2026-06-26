import { useEffect, useMemo, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
    finishQuiz,
    getCurrentQuestion,
    nextQuestion,
    skipQuestion,
    submitAnswer,
} from "../../api/quizApi";

import ProgressBar from "../../components/ui/ProgressBar";

function QuizPage() {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [quizSettings, setQuizSettings] = useState(null);
    const [selectedOptionId, setSelectedOptionId] = useState(null);

    const [questionTimeRemaining, setQuestionTimeRemaining] =
        useState(0);
    const [quizTimeRemaining, setQuizTimeRemaining] = useState(null);

    const [hasAutoFinished, setHasAutoFinished] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Used to disable answers instantly after submission / auto-action starts
    const [answerLocked, setAnswerLocked] = useState(false);

    const isLastQuestion =
        currentQuestion?.order != null &&
        currentQuestion?.total_questions != null
            ? currentQuestion.order === currentQuestion.total_questions
            : false;

    const [lastAnswerSubmitted, setLastAnswerSubmitted] = useState(false);


    const actionInFlightRef = useRef(false);
    const questionExpiryHandledRef = useRef(false);
    const quizFinishHandledRef = useRef(false);

    const questionId = currentQuestion?.id;
    const options = useMemo(() => currentQuestion?.options || [], [currentQuestion]);

    // Used for question progress bar max.
    // Since backend currently gives only remaining seconds, we treat the loaded remaining seconds as the max.
    const [questionTimeMax, setQuestionTimeMax] = useState(0);

    const formatSeconds = (totalSeconds) => {
        const safe = Number.isFinite(Number(totalSeconds))
            ? Math.max(0, Number(totalSeconds))
            : 0;
        const minutes = Math.floor(safe / 60);
        const seconds = safe % 60;
        return { minutes, seconds };
    };

    const getQuestionTimerEnabled = () => quizSettings?.use_question_timer === true;
    const getWholeQuizTimerEnabled = () => quizSettings?.use_quiz_timer === true;

    const loadCurrentQuestion = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getCurrentQuestion(attemptId);
            const data = response?.data;

            if (!data) {
                setCurrentQuestion(null);
                setQuizSettings(null);
                setSelectedOptionId(null);
                setQuestionTimeRemaining(0);
                setQuestionTimeMax(0);
                setAnswerLocked(false);
                return;
            }

            setCurrentQuestion(data.question ?? null);
            setQuizSettings(data.quiz_settings ?? null);
            setSelectedOptionId(null);
            setAnswerLocked(false);

            const remaining = data?.question?.time_remaining_seconds ?? 0;
            setQuestionTimeRemaining(remaining);
            setQuestionTimeMax(remaining > 0 ? remaining : 0);

            // Initialize quiz timer once per quiz (avoid re-initializing on every question load)
            if (quizTimeRemaining == null) {
                const useQuizTimer = data?.quiz_settings?.use_quiz_timer;
                const totalTimeMinutes = data?.quiz_settings?.total_time_minutes;

                if (useQuizTimer === true && totalTimeMinutes != null) {
                    const totalSeconds = Number(totalTimeMinutes) * 60;
                    if (Number.isFinite(totalSeconds) && totalSeconds > 0) {
                        setQuizTimeRemaining(Math.round(totalSeconds));
                    } else {
                        setQuizTimeRemaining(0);
                    }
                }
            }
        } catch (err) {
            setError(JSON.stringify(err?.response?.data || err?.message || err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!attemptId) return;
        loadCurrentQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attemptId]);

    // Prevent duplicate whole-quiz finish
    useEffect(() => {
        if (quizTimeRemaining == null) return;
        if (quizTimeRemaining > 0) return;
        if (quizFinishHandledRef.current) return;

        quizFinishHandledRef.current = true;
        setHasAutoFinished(true);

        (async () => {
            try {
                await finishQuiz({ attempt_id: attemptId });
            } catch {
                // still navigate
            } finally {
                navigate(`/results/${attemptId}`);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quizTimeRemaining, attemptId, navigate]);

    // Whole quiz countdown
    useEffect(() => {
        if (quizTimeRemaining == null) return;
        if (quizTimeRemaining <= 0) return;

        const id = setInterval(() => {
            setQuizTimeRemaining((prev) => {
                if (prev == null) return prev;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [quizTimeRemaining]);

    // Question countdown
    useEffect(() => {
        if (!currentQuestion) return;
        if (hasAutoFinished) return;
        if (questionTimeRemaining <= 0) return;

        const id = setInterval(() => {
            setQuestionTimeRemaining((prev) => {
                if (prev <= 0) return prev;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [currentQuestion, questionTimeRemaining, hasAutoFinished]);

    const performQuestionAutoAction = async () => {
        if (!currentQuestion) return;
        if (questionExpiryHandledRef.current) return;
        if (actionInFlightRef.current) return;

        // Lock UI immediately
        setAnswerLocked(true);

        questionExpiryHandledRef.current = true;
        actionInFlightRef.current = true;
        setLoading(true);

        try {
            const selected = selectedOptionId;

            if (selected) {
                await submitAnswer({
                    attempt_id: attemptId,
                    question_id: questionId,
                    option_id: selected,
                });
                await nextQuestion({ attempt_id: attemptId });
            } else {
                if (quizSettings?.use_question_timer === true) {
                    await skipQuestion({ attempt_id: attemptId });
                } else {
                    await nextQuestion({ attempt_id: attemptId });
                }
            }

            setSelectedOptionId(null);
            await loadCurrentQuestion();
        } catch (err) {
            setError(JSON.stringify(err?.response?.data || err?.message || err));
            questionExpiryHandledRef.current = false;
        } finally {
            actionInFlightRef.current = false;
            setQuestionTimeRemaining(0);
            setLoading(false);
        }
    };

    // Auto actions on question timer expiry
    useEffect(() => {
        if (!currentQuestion) return;
        if (hasAutoFinished) return;
        if (questionTimeRemaining !== 0) return;
        if (!options) return;

        performQuestionAutoAction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionTimeRemaining, currentQuestion, hasAutoFinished]);

    // Reset expiry marker when question changes
    useEffect(() => {
        questionExpiryHandledRef.current = false;
    }, [currentQuestion?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentQuestion) return;
        if (!questionId) return;
        if (!selectedOptionId) return;
        if (answerLocked) return;
        if (lastAnswerSubmitted) return;

        setAnswerLocked(true);
        setLoading(true);
        setError("");

        try {
            await submitAnswer({
                attempt_id: attemptId,
                question_id: questionId,
                option_id: selectedOptionId,
            });

            if (isLastQuestion) {
                setLastAnswerSubmitted(true);
                return;
            }

            await nextQuestion({ attempt_id: attemptId });
            await loadCurrentQuestion();
        } catch (err) {
            setError(JSON.stringify(err?.response?.data || err?.message || err));
            setAnswerLocked(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = async () => {
        if (!currentQuestion) return;
        if (loading) return;
        if (lastAnswerSubmitted) return;

        setAnswerLocked(true);
        setLoading(true);
        setError("");

        try {
            if (quizSettings?.use_question_timer === false) {
                await nextQuestion({ attempt_id: attemptId });
            } else {
                await skipQuestion({ attempt_id: attemptId });
            }
            await loadCurrentQuestion();
        } catch (err) {
            setError(JSON.stringify(err?.response?.data || err?.message || err));
            setAnswerLocked(false);
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = async () => {
        if (!attemptId) return;
        setLoading(true);
        setError("");

        try {
            await finishQuiz({ attempt_id: attemptId });
        } catch (err) {
            setError(JSON.stringify(err?.response?.data || err?.message || err));
        } finally {
            setLoading(false);
            navigate(`/results/${attemptId}`);
        }
    };

    if (loading && !currentQuestion) return <h2>Loading...</h2>;

    if (!currentQuestion) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-10">
                <h1 className="text-2xl font-bold">Quiz</h1>
                <h2 className="mt-2 text-lg">No more questions.</h2>

                <div className="mt-6">
                    <button
                        onClick={handleFinish}
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                    >
                        Finish Quiz
                    </button>
                </div>

                {error && <h3 className="mt-4 text-sm text-red-600">{error}</h3>}
            </div>
        );
    }

    const { minutes, seconds } = formatSeconds(quizTimeRemaining);

    const answerDisabled = loading || hasAutoFinished || answerLocked || lastAnswerSubmitted;




    const progressForQuestion = () => {
        if (!getQuestionTimerEnabled()) return { value: 0, max: 100 };
        const max = questionTimeMax > 0 ? questionTimeMax : 100;
        return { value: questionTimeRemaining, max };
    };

    const { value: qValue, max: qMax } = progressForQuestion();

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
            <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-black/5 md:p-6 dark:bg-gray-800/90 dark:ring-gray-700">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-700 ring-1 ring-blue-100 dark:bg-blue-900/30 dark:ring-blue-800 dark:text-blue-400">
                            {currentQuestion.order}
                        </div>
                        <div>
<div className="text-sm text-slate-400">Question</div>
                            <div className="text-xl font-bold leading-tight text-slate-100">
                                {currentQuestion.order}
                            </div>
                        </div>
                    </div>

                    <div className="sm:text-right">
                        {getWholeQuizTimerEnabled() && quizTimeRemaining != null && (
                            <div>
<div className="text-sm text-slate-400">Quiz time</div>
                                <div className="text-xl font-bold">
                                    {minutes}:{String(seconds).padStart(2, "0")}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {getWholeQuizTimerEnabled() && quizTimeRemaining != null && (
                    <div className="mt-4">
                        <ProgressBar
                            value={quizTimeRemaining}
                            max={Math.max(1, (quizTimeRemaining + 0))}
                            showPercent={false}
                            className="opacity-90"
                        />
                    </div>
                )}

                {getQuestionTimerEnabled() && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between">
<div className="text-sm text-slate-400">Time left</div>
                            <div className="text-sm font-semibold tabular-nums">
                                {questionTimeRemaining}s
                            </div>
                        </div>
                        <div className="mt-2">
                            <ProgressBar
                                value={qValue}
                                max={qMax}
                                showPercent={false}
                                className="transition-[width] duration-300"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-5">
<h2 className="text-base font-semibold text-slate-100 sm:text-lg">
                        {currentQuestion.question_text}
                    </h2>
                    <div className="mt-2 text-sm text-slate-300">
                        Marks: {currentQuestion.marks}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-5">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        {options.map((opt, idx) => {
                            const optionId = opt.option_id ?? opt.id;
                            const optionText = opt.option_text ?? opt.text;
                            const isSelected = String(selectedOptionId) === String(optionId);

                            // Reveal state (best-effort based on common backend shapes)
                            const selectedCorrectId =
                                currentQuestion?.correct_option_id ??
                                currentQuestion?.correctOptionId ??
                                currentQuestion?.correct_option?.id;

                            const revealCorrectId =
                                selectedCorrectId ??
                                currentQuestion?.answer?.correct_option_id;

                            const revealWrongId =
                                currentQuestion?.wrong_option_id;

                            const optionIsCorrect =
                                opt?.is_correct === true ||
                                String(optionId) === String(revealCorrectId);

                            const optionIsWrong =
                                opt?.is_correct === false ||
                                (revealWrongId != null &&
                                    String(optionId) === String(revealWrongId));

                            const showReveal =
                                Boolean(currentQuestion?.is_revealed) ||
                                Boolean(currentQuestion?.reveal_answers) ||
                                Boolean(currentQuestion?.status) ||
                                Boolean(currentQuestion?.answered);

                            const revealClass = showReveal
                                ? optionIsCorrect
                                    ? "bg-green-900/20 border-green-500"
                                    : optionIsWrong || optionIsWrong == null
                                      ? "bg-red-900/20 border-red-500"
                                      : ""
                                : "";


                            return (
                                <button
                                    key={optionId}
                                    type="button"
                                    onClick={() => setSelectedOptionId(optionId)}
                                    disabled={answerDisabled}
                                    className={[
                                        "w-full rounded-2xl border border-slate-600 bg-slate-800 px-4 py-4 text-left font-semibold text-white",
                                        "shadow-sm transition-all duration-200",
                                        "focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500/30",
                                        "hover:border-blue-500 hover:bg-slate-750 hover:scale-105",
                                        isSelected
                                            ? "bg-blue-900/30 border-blue-500 ring-2 ring-blue-500"
                                            : "",
                                        showReveal && optionIsCorrect
                                            ? "bg-green-900/20 border-green-500"
                                            : "",
                                        showReveal && optionIsWrong
                                            ? "bg-red-900/20 border-red-500"
                                            : "",
                                        answerDisabled && !isSelected ? "opacity-80" : "",
                                    ].join(" ")}

                                >
                                    <span className="block text-sm font-bold opacity-90">
                                        Option {idx + 1}
                                    </span>
                                    <span className="mt-1 block text-base leading-snug sm:text-lg">
                                        {optionText}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="submit"
                            disabled={answerDisabled || !selectedOptionId}
                            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>

<button
                            type="button"
                            onClick={handleSkip}
                            disabled={answerDisabled}
                            className="w-full rounded-xl border border-slate-600 bg-slate-800 px-5 py-2 font-semibold text-slate-100 transition-all duration-200 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-500 sm:w-auto"
                        >
                            Skip
                        </button>

                    </div>

                    {error && (
                        <div className="mt-4 text-sm text-red-600">{error}</div>
                    )}

                    {lastAnswerSubmitted && (
                        <div className="mt-4 text-sm text-gray-700">
                            Last answer submitted successfully. Press Finish Quiz to complete the test.
                        </div>
                    )}

                    {hasAutoFinished && (
                        <div className="mt-4 text-sm text-gray-500">
                            Finishing quiz...
                        </div>
                    )}

                </form>

                    <div className="mt-5">
                    <button
                        onClick={handleFinish}
                        disabled={loading || hasAutoFinished}
                        className="w-full rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
                    >
                        Finish quiz
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizPage;


