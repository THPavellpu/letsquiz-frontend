import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check } from "lucide-react";

import { createQuestionWithOptions, getQuizSummary } from "../../api/quizApi";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

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
    </div>
  );
}

function OptionCard({ index, text, onTextChange, isCorrect, onSelectCorrect, hasError }) {
  return (
    <button
      type="button"
      onClick={onSelectCorrect}
      className={[
        "group relative flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-left transition-all duration-200",
        "hover:border-slate-600 hover:bg-slate-750",
        isCorrect ? "border-green-500/60 bg-green-500/5" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-200">Option {index + 1}</div>
        <div
          className={[
            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-200",
            isCorrect
              ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
              : "bg-slate-700 text-slate-300 group-hover:bg-slate-600",
          ].join(" ")}
          aria-hidden="true"
        >
          {isCorrect ? <Check className="h-4 w-4" /> : index + 1}
        </div>
      </div>

      <Input
        label={null}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={`Write option ${index + 1}`}
        className={[
          "bg-slate-900 text-slate-100 placeholder:text-slate-500 border-slate-600",
          hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "focus:border-blue-500 focus:ring-blue-500/30",
        ].join(" ")}
      />

      {isCorrect ? (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
          <Check className="h-3.5 w-3.5" />
          Correct Answer
        </div>
      ) : (
        <div className="text-xs text-slate-500">Click to mark as correct</div>
      )}
    </button>
  );
}

function getTotalQuestionsFromSummary(summary) {
  const candidates = [
    summary?.total_questions,
    summary?.questions_added,
    summary?.questionsCount,
    summary?.questions_count,
  ];

  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n) && n >= 0) return n;
  }

  // If backend changes shape, fall back to questions array length if present
  if (Array.isArray(summary?.questions)) return summary.questions.length;

  return 0;
}

function AddQuestion() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [questionOrder, setQuestionOrder] = useState(1);
  const [isInitLoading, setIsInitLoading] = useState(true);

  const [question_text, setQuestionText] = useState("");
  const [marks, setMarks] = useState(1);
  const [time_limit_seconds, setTimeLimitSeconds] = useState(30);

  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");

  const [correctAnswer, setCorrectAnswer] = useState("1");

  // Track whether the current question has been saved to prevent duplicate submissions
  const [isSaved, setIsSaved] = useState(false);

  function validateOptions({ opts, correctIdx }) {
    const normalized = opts.map((o) => String(o ?? "").trim());

    const correctIndices = [0, 1, 2, 3].filter((i) => String(correctIdx) === String(i + 1));

    const duplicatesMap = new Map();
    normalized.forEach((val, idx) => {
      const key = val.toLowerCase();
      if (!duplicatesMap.has(key)) duplicatesMap.set(key, new Set());
      duplicatesMap.get(key).add(idx);
    });

    const duplicateIndices = new Set();
    for (const [, idxSet] of duplicatesMap.entries()) {
      if (idxSet.size > 1 && [...idxSet].some((i) => normalized[i] !== "")) {
        for (const i of idxSet) duplicateIndices.add(i);
      }
    }

    const correctCount = correctIndices.length;

    if (duplicateIndices.size > 0) {
      return {
        ok: false,
        error: "Duplicate options are not allowed. Please make all four options unique.",
        duplicateIndices,
      };
    }

    if (correctCount !== 1) {
      return {
        ok: false,
        error: "Please select exactly one correct answer.",
        correctIndices: new Set(correctIndices),
      };
    }

    return { ok: true };
  }

  const options = [option1, option2, option3, option4];
  const currentValidation = validateOptions({
    opts: options,
    correctIdx: correctAnswer,
  });

  const invalidOptionIndices = currentValidation.ok
    ? new Set()
    : currentValidation.duplicateIndices
      ? currentValidation.duplicateIndices
      : new Set();

  const steps = useMemo(
    () => [
      { key: "create", label: "Create Quiz" },
      { key: "questions", label: "Add Questions" },
      { key: "publish", label: "Publish/Finish" },
    ],
    []
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    let cancelled = false;

    async function initOrder() {
      if (!quizId) return;
      setIsInitLoading(true);
      setError("");
      try {
        const resp = await getQuizSummary(quizId);
        if (cancelled) return;
        const summary = resp?.data ?? resp;
        const total = getTotalQuestionsFromSummary(summary);
        setQuestionOrder(total + 1);
      } catch (e) {
        // If the summary endpoint fails, keep current local order (default 1)
        if (!cancelled) setError(JSON.stringify(e?.response?.data || e?.message || e));
      } finally {
        if (!cancelled) setIsInitLoading(false);
      }
    }

    initOrder();

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  async function handleSaveQuestion({ addAnother }) {
    // Prevent duplicate submissions - if already saved and not adding another, block it
    if (isSaved && !addAnother) {
      setError("Question already saved. Click 'Save and Add Another' to add a new question.");
      return;
    }

    if (!currentValidation.ok) {
      setError(currentValidation.error);
      return;
    }

    setMessage("");
    setError("");
    setIsSubmitting(true);

    // For "Save and Add Another": increment order BEFORE the API call to prevent duplicate order
    const nextOrder = addAnother ? questionOrder + 1 : questionOrder;

    try {
      await createQuestionWithOptions({
        quiz: quizId,
        question_text,
        order: nextOrder,
        marks,
        time_limit_seconds,
        options: [
          { option_text: option1, is_correct: correctAnswer === "1" },
          { option_text: option2, is_correct: correctAnswer === "2" },
          { option_text: option3, is_correct: correctAnswer === "3" },
          { option_text: option4, is_correct: correctAnswer === "4" },
        ],
      });

      // Clear and increment based on mode
      if (addAnother) {
        // Save and Add Another: increment order and clear fields for next question
        setQuestionOrder((prev) => prev + 1);
        setQuestionText("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setCorrectAnswer("1");
        setMarks(1);
        setTimeLimitSeconds(30);
        setIsSaved(false);
        setMessage("Question created successfully. Ready for next question.");
      } else {
        // Save Question: mark as saved to prevent duplicate submissions
        setIsSaved(true);
        setMessage("Question created successfully.");
      }
    } catch (err) {
      // If duplicate error, set isSaved to false to allow retry with proper order
      const errorData = err?.response?.data || {};
      if (errorData.order || errorData.non_field_errors?.some(e => e.toLowerCase().includes('duplicate'))) {
        setIsSaved(false);
      }
      setError(JSON.stringify(errorData || err?.message || err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSaveQuestionSubmit() {
    await handleSaveQuestion({ addAnother: false });
  }

  async function handleSaveAndAddAnother() {
    await handleSaveQuestion({ addAnother: true });
  }

  function handleFinishQuizCreation() {
    navigate(`/quiz-summary/${quizId}`);
  }

  const canSubmit = currentValidation.ok && !isInitLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Question</h1>
        <p className="mt-1 text-sm text-gray-600">Build your quiz question-by-question.</p>
      </div>

      <Card padding="lg">
        <div className="space-y-6">
          <StepIndicator steps={steps} activeIndex={1} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-300">
              <span className="font-semibold">Quiz ID:</span> <span className="text-white">{quizId}</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm">
              <span className="font-semibold text-white">Question</span>
              <span className="rounded-full bg-slate-700 px-3 py-1 text-white ring-1 ring-slate-600">
                #{questionOrder}
              </span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSaveQuestionSubmit();
            }}
            className="space-y-5"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Question</label>
              <textarea
                className="w-full min-h-[120px] resize-none rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Question text"
                value={question_text}
                onChange={(e) => {
                  setQuestionText(e.target.value);
                  setIsSaved(false);
                }}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Marks"
                type="number"
                value={marks}
                onChange={(e) => {
                  setMarks(Number(e.target.value));
                  setIsSaved(false);
                }}
              />

              <Input
                label="Time limit (seconds)"
                type="number"
                value={time_limit_seconds}
                onChange={(e) => {
                  setTimeLimitSeconds(Number(e.target.value));
                  setIsSaved(false);
                }}
              />
            </div>

            <div className="pt-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Options</h3>
                <div className="text-xs text-gray-500 dark:text-gray-400">Mark one option as correct</div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <OptionCard
                  index={0}
                  text={option1}
                  isCorrect={correctAnswer === "1"}
                  onSelectCorrect={() => {
                    setCorrectAnswer("1");
                    setIsSaved(false);
                  }}
                  onTextChange={(val) => {
                    setOption1(val);
                    setIsSaved(false);
                  }}
                  hasError={invalidOptionIndices.has(0)}
                />
                <OptionCard
                  index={1}
                  text={option2}
                  isCorrect={correctAnswer === "2"}
                  onSelectCorrect={() => {
                    setCorrectAnswer("2");
                    setIsSaved(false);
                  }}
                  onTextChange={(val) => {
                    setOption2(val);
                    setIsSaved(false);
                  }}
                />
                <OptionCard
                  index={2}
                  text={option3}
                  isCorrect={correctAnswer === "3"}
                  onSelectCorrect={() => {
                    setCorrectAnswer("3");
                    setIsSaved(false);
                  }}
                  onTextChange={(val) => {
                    setOption3(val);
                    setIsSaved(false);
                  }}
                />
                <OptionCard
                  index={3}
                  text={option4}
                  isCorrect={correctAnswer === "4"}
                  onSelectCorrect={() => {
                    setCorrectAnswer("4");
                    setIsSaved(false);
                  }}
                  onTextChange={(val) => {
                    setOption4(val);
                    setIsSaved(false);
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting || !canSubmit || isSaved}
                isLoading={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSaved ? "Question Saved" : "Save Question"}
              </Button>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  disabled={isSubmitting || !canSubmit}
                  onClick={() => void handleSaveAndAddAnother()}
                  className="w-full sm:w-auto"
                >
                  Save and Add Another Question
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={isSubmitting}
                  onClick={handleFinishQuizCreation}
                  className="w-full sm:w-auto"
                >
                  Finish Quiz Creation
                </Button>
              </div>
            </div>

            {message ? (
              <div
                className={[
                  "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800",
                  "animate-[fadeIn_180ms_ease-out]",
                ].join(" ")}
                role="status"
              >
                <span className="mr-2 inline-flex h-2 w-2 items-center justify-center rounded-full bg-emerald-500" />
                {message}
              </div>
            ) : null}

            {error ? (
              <div
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
                role="alert"
              >
                {error}
              </div>
            ) : null}
          </form>
        </div>
      </Card>
    </div>
  );
}

export default AddQuestion;

