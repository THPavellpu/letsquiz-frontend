import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


import { createQuestionWithOptions, createQuiz, generateAiQuiz } from "../../api/quizApi";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import { validateAiQuestion } from "./questionValidation";


function StepIndicator({ steps, activeIndex }) {
  return (
    <div className="w-full">
      <ol className="grid grid-cols-3 gap-3">
        {steps.map((s, idx) => {
          const isDone = idx < activeIndex;
          const isActive = idx === activeIndex;

          return (
            <li key={s.key} className="flex items-center gap-3">
              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                  isDone
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : isActive
                      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                      : "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
                ].join(" ")}
              >
                {isDone ? <span aria-hidden="true">✓</span> : <span aria-hidden="true">{idx + 1}</span>}
              </div>

              <div className="min-w-0">
                <div
                  className={[
                    "truncate text-sm",
                    isDone
                      ? "text-emerald-700"
                      : isActive
                        ? "text-blue-700"
                        : "text-gray-500",
                  ].join(" ")}
                >
                  {s.label}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 hidden sm:block">
        <div className="h-px w-full bg-gray-200" />
      </div>
    </div>
  );
}

function OptionCard({ index, text, isCorrect, onTextChange, onSelectCorrect, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelectCorrect}
      className={[
        "group relative flex flex-col gap-2 rounded-2xl border p-4 text-left transition",
        isCorrect ? "border-blue-300 bg-blue-50 ring-2 ring-blue-200" : "border-gray-200 bg-white hover:bg-gray-50",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Option {index + 1}</div>
        <div
          className={[
            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
            isCorrect ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 group-hover:bg-gray-200",
          ].join(" ")}
          aria-hidden="true"
        >
          {isCorrect ? "✓" : index + 1}
        </div>
      </div>

      <Input
        label={null}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={`Write option ${index + 1}`}
        disabled={disabled}
        className={["bg-transparent", "border-gray-200 focus:border-blue-500 focus:ring-blue-200"].join(" ")}
      />

      <div className="text-xs text-gray-500">Click to mark as correct</div>
    </button>
  );
}

function AccordionQuestionCard({
  question,
  index,
  onChange,
  onDelete,
  onAddQuestion,
  disabled,
  isOpen,
  onToggle,
}) {
  return (
    <Card padding="lg" className="bg-white dark:bg-slate-800 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="w-full text-left"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" className="gap-1">
                AI
                <span aria-hidden="true">✨</span>
              </Badge>
              {question?.difficulty ? (
                <Badge variant="neutral">{String(question.difficulty).toUpperCase()}</Badge>
              ) : null}
              <Badge variant="success">{question?.marks ?? 1} Marks</Badge>
            </div>
            <div className="text-xs text-gray-500">Question {index + 1}</div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white ring-1 ring-slate-600">
              {isOpen ? "Hide" : "Edit"}
            </span>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(index);
              }}
              disabled={disabled}
              className="h-10 px-3"
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <div className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            {question?.question_text?.trim() ? question.question_text : "(Empty question)"}
          </div>
        </div>
      </button>

      {isOpen ? (
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Question text
            </label>
            <textarea
              className="w-full min-h-[110px] resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900/30 dark:text-gray-100"
              value={question.question_text}
              onChange={(e) =>
                onChange(index, {
                  ...question,
                  question_text: e.target.value,
                })
              }
              disabled={disabled}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Marks"
              type="number"
              value={question.marks ?? 1}
              onChange={(e) =>
                onChange(index, {
                  ...question,
                  marks: Number(e.target.value),
                })
              }
              disabled={disabled}
            />

            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-slate-300">Correct answer</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Select the option that is correct.</div>
            </div>
          </div>

          <div className="pt-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Options</h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">Mark one option as correct</div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <OptionCard
                  key={i}
                  index={i}
                  text={question.options?.[i]?.option_text ?? ""}
                  isCorrect={question.options?.[i]?.is_correct === true}
                  onTextChange={(v) => {
                    const next = [...(question.options ?? [])];
                    next[i] = {
                      ...(next[i] ?? {}),
                      option_text: v,
                      is_correct: next[i]?.is_correct ?? false,
                    };
                    onChange(index, { ...question, options: next });
                  }}
                  onSelectCorrect={() => {
                    const next = (question.options ?? []).map((opt, idx) => ({
                      ...(opt ?? {}),
                      is_correct: idx === i,
                    }));
                    onChange(index, { ...question, options: next });
                  }}
                  disabled={disabled}
                />
              ))}
            </div>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={disabled}
                onClick={() => onAddQuestion()}
                className="w-full sm:w-auto"
              >
                Add question
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function createEmptyQuestion({ marks = 1, difficulty = "medium" } = {}) {
  return {
    question_text: "",
    marks,
    difficulty,
    options: [
      { option_text: "", is_correct: true },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ],
  };
}

function CreateQuiz() {
  const navigate = useNavigate();
  const location = useLocation();


  // Manual quiz creation fields (preserved)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalTimeMinutes, setTotalTimeMinutes] = useState("");
  const [useQuizTimer, setUseQuizTimer] = useState(true);
  const [useQuestionTimer, setUseQuestionTimer] = useState(false);
  const [questionTimeLimit, setQuestionTimeLimit] = useState(30);

  const steps = useMemo(
    () => [
      { key: "details", label: "Details" },
      { key: "timers", label: "Timers" },
      { key: "done", label: "Done" },
    ],
    []
  );

  const activeStepIndex = useMemo(() => {
    if (useQuizTimer !== true || useQuestionTimer !== false) return 1;
    return 0;
  }, [useQuizTimer, useQuestionTimer]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Join deadline (No deadline vs Set deadline)
  const [joinDeadlineMode, setJoinDeadlineMode] = useState("none"); // none | set
  const [joinDeadlineDate, setJoinDeadlineDate] = useState(""); // yyyy-mm-dd
  const [joinDeadlineTime, setJoinDeadlineTime] = useState(""); // hh:mm (24h)

  const joinDeadlineIso = useMemo(() => {
    if (joinDeadlineMode !== "set") return null;
    if (!joinDeadlineDate || !joinDeadlineTime) return null;

    // Combine local date + time into an ISO string (UTC conversion)
    const local = new Date(`${joinDeadlineDate}T${joinDeadlineTime}:00`);
    if (Number.isNaN(local.getTime())) return null;
    return local.toISOString();
  }, [joinDeadlineMode, joinDeadlineDate, joinDeadlineTime]);

  function getFriendlyJoinDeadlineError(err) {
    const msg = String(
      err?.response?.data?.detail ??
        err?.response?.data?.message ??
        err?.message ??
        ""
    );

    // Normalize common casing/phrasing
    const normalized = msg.toLowerCase();
    if (
      normalized.includes("joining deadline passed") ||
      normalized.includes("join deadline passed") ||
      normalized.includes("quiz closed")
    ) {
      return (
        <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-400">⚠ Quiz Closed</h3>

          <p className="text-gray-300 mt-2">
            This quiz is no longer accepting participants because the join deadline has passed.
          </p>
        </div>
      );
    }

    // Never dump raw JSON to the UI.
    return msg || "Something went wrong.";
  }



  // Flow mode
  const [mode, setMode] = useState("manual"); // manual | ai

  // AI settings
  const [aiTopic, setAiTopic] = useState("");
  const [aiNumberOfQuestions, setAiNumberOfQuestions] = useState(10);
  const [aiDifficulty, setAiDifficulty] = useState("medium");

  // AI generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState([]);
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null); // null means all expanded initially

  useEffect(() => {
    const navState = location?.state;
    const incoming = navState?.generatedQuestions;
    const incomingMode = navState?.mode;

    if (!incoming || !Array.isArray(incoming) || incoming.length === 0) return;
    if (incomingMode !== "ai") return;

    // Prevent duplicate load on refresh/back.
    // Also clears navigation state before any setState to avoid effect cascading issues.
    navigate(location.pathname, { replace: true, state: {} });

    // Normalize incoming AI questions (same as handleAiGenerate)
    const normalized = Array.isArray(incoming) ? incoming.map((q) => normalizeAiQuestion(q, aiDifficulty)) : [];

    setMode("ai");
    setAiGeneratedQuestions(normalized);
    setOpenQuestionIndex(null); // Expand all questions initially
  }, [location, navigate]);



  // Save quiz state
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(""), 5500);
    return () => clearTimeout(t);
  }, [error]);

  async function handleManualSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");
    setIsSubmitting(true);

    const joinDeadline = joinDeadlineIso ?? null;


    try {
      const response = await createQuiz({
        title,
        description,
        total_time_minutes: totalTimeMinutes,
        use_quiz_timer: useQuizTimer,
        use_question_timer: useQuestionTimer,
        question_time_limit: useQuestionTimer ? questionTimeLimit : null,
        join_deadline: joinDeadline,
      });

      const quizId = response?.data?.id;
      if (quizId) {
        navigate(`/add-question/${quizId}`);
        return;
      }

      setMessage("Quiz created successfully.");
    } catch (err) {
      const friendly = getFriendlyJoinDeadlineError(err);
      setError(friendly);
    } finally {
      setIsSubmitting(false);
    }
  }


function normalizeAiQuestion(q, fallbackDifficulty) {
    const questionText = String(q?.question_text ?? q?.question ?? "");
    const marks = Number(q?.marks ?? 1);
    const difficulty = q?.difficulty ? String(q.difficulty) : fallbackDifficulty;

    // Gemini-supported shapes:
    // 1) { question, options: ["A","B","C","D"], correct_answer: 2 }
    // 2) { question, options: ["A","B","C","D"], correct_answer: 0 }
    // Also tolerate: answers/choices/options arrays and option objects.

    const rawOptions = Array.isArray(q?.options)
      ? q.options
      : Array.isArray(q?.answers)
        ? q.answers
        : Array.isArray(q?.choices)
          ? q.choices
          : Array.isArray(q?.option)
            ? q.option
            : [];

    const correctAnswerIndex =
      q?.correct_answer !== undefined && q?.correct_answer !== null
        ? Number(q.correct_answer)
        : undefined;

    const four = Array.from({ length: 4 }).map((_, i) => {
      const raw = rawOptions?.[i];

    // If raw options are strings, take them directly.
      const option_text =
        typeof raw === "string" || typeof raw === "number"
          ? String(raw)
          : String(raw?.option_text ?? raw?.text ?? "");

      // Determine correctness:
      // Priority: correct_answer index (Gemini)
      // Else: option object hints
      let is_correct;
      if (typeof correctAnswerIndex === "number" && Number.isFinite(correctAnswerIndex)) {
        is_correct = i === correctAnswerIndex;
      } else {
        const candidate = raw;
        is_correct = Boolean(
          candidate?.is_correct ??
            candidate?.correct ??
            candidate?.isCorrect ??
            candidate?.correct_answer
        );
        // If candidate itself is an index/number
        if (!is_correct && typeof candidate === "number") {
          is_correct = i === candidate;
        }
      }

      return { option_text, is_correct };
    });

    // Guarantee: exactly one option has is_correct:true
    const trueIdxs = four
      .map((o, idx) => ({ o, idx }))
      .filter(({ o }) => o.is_correct)
      .map(({ idx }) => idx);

    if (trueIdxs.length === 0) {
      four[0].is_correct = true;
    } else {
      // Keep first true, unset others
      const keep = trueIdxs[0];
      four.forEach((opt, idx) => {
        opt.is_correct = idx === keep;
      });
    }

    return {
      question_text: questionText,
      marks,
      difficulty,
      options: four,
    };
  }

  async function handleAiGenerate() {
    setMessage("");
    setError("");
    setIsGenerating(true);

    try {
      const payload = {
        topic: aiTopic,
        number_of_questions: Number(aiNumberOfQuestions),
        difficulty: aiDifficulty,
      };

      const response = await generateAiQuiz(payload);
      const data = response?.data;

      const questions = data?.questions ?? data?.generated_questions ?? data?.results ?? data ?? [];
      const normalized = Array.isArray(questions) ? questions.map((q) => normalizeAiQuestion(q, aiDifficulty)) : [];

      setAiGeneratedQuestions(normalized);
      setOpenQuestionIndex(null); // Expand all questions initially after generation
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (detail === "Failed to generate quiz.") setError("Failed to generate quiz.");
      else setError(getFriendlyJoinDeadlineError(err));
      setAiGeneratedQuestions([]);
    } finally {
      setIsGenerating(false);
    }
  }


  function handleAiQuestionChange(index, nextQuestion) {
    setAiGeneratedQuestions((prev) => {
      const copy = [...prev];
      copy[index] = nextQuestion;
      return copy;
    });
  }

  function handleAiQuestionDelete(index) {
    setAiGeneratedQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAiAddManualQuestion() {
    setAiGeneratedQuestions((prev) => [...prev, createEmptyQuestion({ marks: 1, difficulty: aiDifficulty })]);
  }

  const validateAllAiQuestions = () => {
    const failures = [];
    const questionStates = aiGeneratedQuestions.map((q, idx) => {
      const res = validateAiQuestion({ question: q });
      if (!res.ok) failures.push({ idx, error: res.error });
      return res;
    });

    return { ok: failures.length === 0, failures, questionStates };
  };

  async function handleAiSaveDraft() {
    // PART 7: Save Quiz creates draft only, shows toast, does NOT navigate
    setMessage("");
    setError("");
    setIsSavingQuiz(true);

    const joinDeadline = joinDeadlineIso ?? null;

    try {
      const quizResp = await createQuiz({

        title,
        description,
        total_time_minutes: totalTimeMinutes,
        use_quiz_timer: useQuizTimer,
        use_question_timer: useQuestionTimer,
        question_time_limit: useQuestionTimer ? questionTimeLimit : null,
        join_deadline: joinDeadline,
      });

      const quizId = quizResp?.data?.id;
      if (!quizId) throw new Error("Quiz id missing after creation");

      // Store quizId for later use in Finish Quiz Creation
      setAiQuizId(quizId);

      // Show toast message - DO NOT navigate
      setMessage("Draft saved successfully.");
    } catch (err) {
      setError(getFriendlyJoinDeadlineError(err));
    } finally {
      setIsSavingQuiz(false);
    }
  }


  const [aiQuizId, setAiQuizId] = useState(null);

  async function handleAiFinishQuiz() {
    // PART 8: Finish Quiz Creation - publishes and navigates to quiz summary
    setMessage("");
    setError("");
    setIsSavingQuiz(true);

    const joinDeadline = joinDeadlineIso ?? null;


    try {
      let quizId = aiQuizId;

      // If no draft saved yet, create the quiz first
      if (!quizId) {
        const quizResp = await createQuiz({
          title,
          description,
          total_time_minutes: totalTimeMinutes,
          use_quiz_timer: useQuizTimer,
          use_question_timer: useQuestionTimer,
          question_time_limit: useQuestionTimer ? questionTimeLimit : null,
          join_deadline: joinDeadline,
        });

        quizId = quizResp?.data?.id;
        if (!quizId) throw new Error("Quiz id missing after creation");
      }

      // Add all questions
      for (let i = 0; i < aiGeneratedQuestions.length; i++) {
        const q = aiGeneratedQuestions[i];
        await createQuestionWithOptions({
          quiz: quizId,
          question_text: q.question_text,
          order: i + 1,
          marks: q.marks ?? 1,
          time_limit_seconds: 30,
          options: (q.options ?? []).map((opt) => ({
            option_text: opt.option_text,
            is_correct: opt.is_correct === true,
          })),
        });
      }

      // Navigate to quiz summary
      navigate(`/quiz-summary/${quizId}`);
    } catch (err) {
      setError(getFriendlyJoinDeadlineError(err));
    } finally {
      setIsSavingQuiz(false);
    }
  }


  function handleCancel() {
    setMode("manual");
    setAiGeneratedQuestions([]);
    setAiQuizId(null);
    setOpenQuestionIndex(null);
    setError("");
    setMessage("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Quiz</h1>
        <p className="mt-1 text-sm text-gray-600">Set up quiz details and timing options.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div
          className={[
            "group relative overflow-hidden rounded-2xl border p-5 text-left transition",
            "border-blue-300 bg-blue-50 dark:bg-blue-900/30",
          ].join(" ")}
        >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                ✍️
              </div>
              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">Manual Quiz</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Create questions manually.</div>
              </div>
            </div>
            <div className="mt-4">
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                onClick={() => {
                  // Preserve manual quiz creation flow
                  setMode("manual");
                  setError("");
                  setMessage("");
                }}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </div>
          <Badge variant="primary">Manual</Badge>
        </div>

        </div>

        <div
          className={[
            "group relative overflow-hidden rounded-2xl border p-5 text-left transition",
            "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                  ✨
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-900 dark:text-gray-100">AI Generate Quiz</div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Generate questions automatically using Gemini AI.</div>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  disabled={isGenerating}
                  isLoading={isGenerating}
                  onClick={() => navigate("/ai-generate")}
                  className="w-full"
                >
                  Generate with AI
                </Button>
              </div>
            </div>
            <Badge variant="success">AI</Badge>
          </div>
        </div>
      </div>


      {/* shared details */}
      <Card className="bg-white dark:bg-slate-800" shadow={true} padding="lg">
        <div className="space-y-6">
          <StepIndicator steps={steps} activeIndex={message ? 2 : activeStepIndex} />

          <form onSubmit={handleManualSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. React Basics" />
              <Input
                label="Total Time (minutes)"
                type="number"
                value={totalTimeMinutes}
                onChange={(e) => setTotalTimeMinutes(e.target.value)}
                placeholder="30"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Description</label>
              <textarea
                className="w-full min-h-[110px] resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900/30 dark:text-gray-100"
                placeholder="What will players learn or practice?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={useQuizTimer}
                  onChange={(e) => setUseQuizTimer(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-blue-400"
                />
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Use quiz timer</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Players see the overall timer.</div>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={useQuestionTimer}
                  onChange={(e) => setUseQuestionTimer(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-blue-400"
                />
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Use question timer</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Adds per-question timer.</div>
                </div>
              </label>
            </div>

            {/* Join Deadline */}
            <div className="mt-4 space-y-3">
              <div className="text-sm font-medium text-slate-300">Join Deadline</div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="join-deadline-mode"
                    checked={joinDeadlineMode === "none"}
                    onChange={() => setJoinDeadlineMode("none")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-blue-400"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">No deadline</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Participants can join anytime.</div>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="join-deadline-mode"
                    checked={joinDeadlineMode === "set"}
                    onChange={() => setJoinDeadlineMode("set")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-blue-400"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Set deadline</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Close joining after the selected datetime.</div>
                  </div>
                </label>
              </div>

              {joinDeadlineMode === "set" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">Date</label>
                    <input
                      type="date"
                      value={joinDeadlineDate}
                      onChange={(e) => setJoinDeadlineDate(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">Time</label>
                    <input
                      type="time"
                      step={60}
                      value={joinDeadlineTime}
                      onChange={(e) => setJoinDeadlineTime(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Question Time Limit - shown when useQuestionTimer is enabled */}
            {useQuestionTimer && (
              <div className="mt-4">
                <Input
                  label="Question Time Limit (seconds)"
                  type="number"
                  min={5}
                  max={300}
                  value={questionTimeLimit}
                  onChange={(e) => setQuestionTimeLimit(Number(e.target.value) || 30)}
                  placeholder="30"
                />
              </div>
            )}


            {mode === "manual" ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Create Quiz
                </Button>
              </div>
            ) : null}
          </form>
        </div>
      </Card>

      {/* AI flow */}
      {mode === "ai" ? (
        <div className="space-y-6">
          <Card className="bg-white dark:bg-slate-800" shadow={true} padding="lg">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  AI Generator <span aria-hidden="true" className="ml-1">✨</span>
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Generate questions automatically with Gemini.</div>
              </div>
              <Badge variant="success">AI</Badge>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                label="Topic"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Probability and Statistics BTech"
                className="md:col-span-1"
              />

              <Input
                label="Number of Questions"
                type="number"
                min={1}
                max={50}
                value={aiNumberOfQuestions}
                onChange={(e) => setAiNumberOfQuestions(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
              />

              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-300">Difficulty</div>
                <select
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={isGenerating || !aiTopic || isSavingQuiz}
                isLoading={isGenerating}
                onClick={handleAiGenerate}
                className="w-full sm:w-auto"
              >
                ✨ Generate with AI
              </Button>

              <div className="min-h-[32px] text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                {isGenerating ? (
                  <>
                    <LoadingSpinner size={18} />
                    <span>Generating questions... Please wait.</span>
                  </>
                ) : null}
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">
                {message}
              </div>
            ) : null}
          </Card>

          <Card className="bg-white dark:bg-slate-800" shadow={true} padding="lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Edit Questions</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Update text, options, correct answer and marks.</div>
              </div>
              <Badge variant="primary">Editable</Badge>
            </div>

            <div className="mt-5 space-y-4">
              {aiGeneratedQuestions.length ? (
                aiGeneratedQuestions.map((q, idx) => (
                  <AccordionQuestionCard
                    key={idx}
                    question={q}
                    index={idx}
                    onChange={handleAiQuestionChange}
                    onDelete={handleAiQuestionDelete}
                    onAddQuestion={() => handleAiAddManualQuestion()}
                    disabled={isGenerating || isSavingQuiz}
                    isOpen={openQuestionIndex === null || openQuestionIndex === idx}
                    onToggle={() => setOpenQuestionIndex(openQuestionIndex === idx ? null : idx)}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
                  No questions generated yet. Generate questions to start editing.
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {isSavingQuiz ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
                  Finalizing quiz… Please wait.
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  disabled={isGenerating || isSavingQuiz || !aiTopic}
                  onClick={handleAiGenerate}
                  className="w-full sm:w-auto"
                >
                  Generate Again
                </Button>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Button type="button" variant="outline" size="lg" disabled={isGenerating || isSavingQuiz} onClick={handleCancel} className="w-full sm:w-auto">
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    disabled={isGenerating || isSavingQuiz || aiGeneratedQuestions.length === 0}
                    isLoading={isSavingQuiz}
                    onClick={handleAiSaveDraft}
                    className="w-full sm:w-auto"
                  >
                    Save Quiz
                  </Button>
                </div>
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={isGenerating || isSavingQuiz || aiGeneratedQuestions.length === 0}
                  isLoading={isSavingQuiz}
                  onClick={handleAiFinishQuiz}
                  className="w-full"
                >
                  Finish Quiz Creation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

export default CreateQuiz;

