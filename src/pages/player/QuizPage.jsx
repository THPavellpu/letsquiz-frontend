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
    const formRef = useRef(null);

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

    if (loading && !currentQuestion) return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-400" />
                <p className="text-sm text-slate-400">Loading question...</p>
            </div>
        </div>
    );

    if (!currentQuestion) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
                    <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white">Quiz Complete!</h1>
                <p className="mt-2 text-sm text-slate-400">No more questions remaining.</p>

                <div className="mt-8">
                    <button
                        onClick={handleFinish}
                        disabled={loading}
                        className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60"
                    >
                        Finish Quiz
                    </button>
                </div>

                {error && <h3 className="mt-4 text-sm text-red-400">{error}</h3>}
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
        <div className="mx-auto w-full max-w-3xl px-4 py-6 pb-28 sm:pb-6">
            <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 shadow-lg shadow-black/5 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-xl font-bold text-indigo-400 ring-1 ring-indigo-500/30">
                            {currentQuestion.order}
                        </div>
                        <div>
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Question</div>
                            <div className="text-xl font-bold leading-tight text-white">
                                {currentQuestion.order}
                                <span className="ml-1 text-sm font-normal text-slate-500">/ {currentQuestion.total_questions}</span>
                            </div>
                        </div>
                    </div>

                    <div className="sm:text-right">
                        {getWholeQuizTimerEnabled() && quizTimeRemaining != null && (
                            <div>
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Time Left</div>
                                <div className="text-2xl font-extrabold text-indigo-400 tabular-nums">
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
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Question Time</div>
                            <div className="text-sm font-semibold tabular-nums text-slate-300">
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

                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-white sm:text-xl leading-relaxed">
                        {currentQuestion.question_text}
                    </h2>
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                        <span className="inline-flex items-center rounded-full bg-slate-700/50 px-2 py-0.5 text-xs font-medium">
                            {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                        </span>
                    </div>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="mt-5">
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
                                    aria-pressed={isSelected}
                                    aria-disabled={answerDisabled}
                                    className={[
                                        "w-full rounded-2xl border border-slate-600/50 bg-slate-800/50 px-4 py-4 text-left font-semibold text-white",
                                        "shadow-sm transition-all duration-200",
                                        "focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
                                        "hover:border-indigo-500/50 hover:bg-slate-700/50 hover:scale-[1.01]",
                                        "min-h-[72px]",
                                        isSelected
                                            ? "bg-indigo-500/20 border-indigo-500 ring-2 ring-indigo-500/30"
                                            : "",
                                        showReveal && optionIsCorrect
                                            ? "bg-emerald-500/20 border-emerald-500"
                                            : "",
                                        showReveal && optionIsWrong
                                            ? "bg-red-500/20 border-red-500"
                                            : "",
                                        answerDisabled && !isSelected ? "opacity-60" : "",
                                    ].join(" ")}

                                >
                                    <div className="flex items-start gap-3">
                                        <div className={[
                                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-colors",
                                            isSelected
                                                ? "bg-indigo-500 text-white"
                                                : "bg-slate-700 text-slate-300",
                                        ].join(" ")}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="flex-1 text-base leading-relaxed sm:text-lg">
                                            {optionText}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            onClick={handleSkip}
                            disabled={answerDisabled}
                            className="w-full rounded-xl border border-slate-600 bg-slate-800 px-5 py-3 font-semibold text-slate-100 transition-all duration-200 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-500 sm:w-auto"
                        >
                            Skip
                        </button>

                        <button
                            type="submit"
                            disabled={answerDisabled || !selectedOptionId}
                            className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60 sm:w-auto"
                        >
                            {loading ? "Submitting..." : "Submit Answer"}
                        </button>

                    </div>

                    {error && (
                        <div className="mt-4 text-sm text-red-400">{error}</div>
                    )}

                    {lastAnswerSubmitted && (
                        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                            Answer submitted! You're on the last question. Click "Finish quiz" when ready.
                        </div>
                    )}

                    {hasAutoFinished && (
                        <div className="mt-4 text-sm text-slate-400">
                            Quiz finishing...
                        </div>
                    )}

                </form>

                    <div className="mt-6 pt-4 border-t border-slate-700/50">
                        <button
                            onClick={handleFinish}
                            disabled={loading || hasAutoFinished}
                            className="w-full rounded-xl bg-slate-700 px-4 py-3 font-semibold text-white transition hover:bg-slate-600 disabled:opacity-60"
                        >
                            Finish Quiz
                        </button>
                </div>
            </div>
            {/* Mobile fixed action bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
                <div className="backdrop-blur-md bg-slate-900/90 border-t border-slate-700/50 px-4 py-3">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleSkip}
                            disabled={answerDisabled}
                            className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 font-semibold text-slate-100 transition hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-500"
                        >
                            Skip
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (formRef.current?.requestSubmit) {
                                    formRef.current.requestSubmit();
                                } else {
                                    handleSubmit({ preventDefault: () => {} });
                                }
                            }}
                            disabled={answerDisabled || !selectedOptionId}
                            className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60"
                        >
                            {loading ? "..." : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizPage;


