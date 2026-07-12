import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CheckCircle, XCircle, Clock, Target, TrendingUp, Award, Home, RotateCcw, BarChart3 } from "lucide-react";

import { getAttemptResult } from "../../api/quizApi";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import StatCard from "../../components/ui/StatCard";
import SectionHeader from "../../components/ui/SectionHeader";
import { formatDateTime } from "../../utils/dateUtils";


function normalizePercent(score, totalQuestions) {
  if (score == null || totalQuestions == null) return null;
  const s = Number(score);
  const t = Number(totalQuestions);
  if (!Number.isFinite(s) || !Number.isFinite(t) || t <= 0) return null;
  return Math.round((s / t) * 100);
}

function percentToCategory(pct) {
  if (pct == null) return { label: "", color: "neutral", className: "" };
  if (pct >= 90) return { label: "Excellent", color: "success" };
  if (pct >= 70) return { label: "Great", color: "primary" };
  if (pct >= 50) return { label: "Good", color: "warning" };
  return { label: "Needs Improvement", color: "danger" };
}


function formatDateOnly(dateValue) {
  if (!dateValue) return null;
  const { date } = formatDateTime(dateValue);
  return date ?? null;
}





function formatTimeOnly(dateValue) {
  if (!dateValue) return null;
  const { time } = formatDateTime(dateValue);
  return time ?? null;
}

function formatSeconds(totalSeconds) {
  if (totalSeconds == null || Number.isNaN(Number(totalSeconds))) return null;
  const s = Math.max(0, Math.floor(Number(totalSeconds)));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}


function CircularProgress({ percentage, tone }) {
  const safePct = percentage == null ? 0 : Math.max(0, Math.min(100, percentage));
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safePct / 100) * circumference;

  const toneStyles = {
    success: "stroke-emerald-400",
    primary: "stroke-sky-400",
    warning: "stroke-amber-300",
    danger: "stroke-red-400",
    neutral: "stroke-slate-400",
  };

  const trackStyles = "stroke-white/10";

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg width="112" height="112" className="-rotate-90">
        <circle
          cx="56"
          cy="56"
          r={radius}
          strokeWidth="10"
          fill="transparent"
          className={trackStyles}
        />
        <circle
          cx="56"
          cy="56"
          r={radius}
          strokeWidth="10"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={toneStyles[tone] ?? toneStyles.neutral}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-bold leading-none text-white">{percentage}%</div>
        <div className="mt-1 text-[11px] font-medium text-slate-300">Score</div>
      </div>

    </div>
  );
}

function ScoreToneBadge({ percentage }) {
  const pct = percentage;
  const cat = percentToCategory(pct);
  return (
    <Badge
      variant={cat.color === "success" ? "success" : cat.color === "primary" ? "primary" : cat.color === "warning" ? "warning" : cat.color === "danger" ? "danger" : "neutral"}
      className="ml-2"
    >
      {pct != null ? `${pct}%` : ""}
    </Badge>
  );
}


function ResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  // Temporary debug logs (do not remove until debugging is complete)
  console.log("attemptId =", attemptId);


  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadAttemptStatus() {
      setLoading(true);
      setError("");

      try {
        const response = await getAttemptResult(attemptId);

        console.log("ATTEMPT RESULT RESPONSE", response.data);
        if (isMounted) setResult(response.data);
      } catch (err) {

        if (!isMounted) return;
        setError(JSON.stringify(err?.response?.data || err?.message || err));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (attemptId) loadAttemptStatus();
    else {
      setLoading(false);
      setError("Missing attemptId.");
    }

    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  // Temporary deep-debug logs for shape verification
  console.log("ATTEMPT RESULT QUESTIONS", result?.questions);

  const score = result?.score ?? result?.marks ?? result?.result_score;

  const totalQuestions =
    result?.total_questions ??
    result?.totalQuestions ??
    result?.total_questions_count ??
    result?.questions_total;

  const percentage = normalizePercent(score, totalQuestions);

  const requiredResultMissing =
    !result ||
    !result?.quiz_title ||
    percentage == null ||
    totalQuestions == null ||
    !Array.isArray(result?.questions) &&
    !Array.isArray(result?.question_results) &&
    !Array.isArray(result?.review) &&
    !Array.isArray(result?.per_question);


  const startedAt = result?.started_at ?? result?.start_time ?? result?.startedAt;
  const finishedAt = result?.finished_at ?? result?.finish_time ?? result?.finishedAt;
  const quizId = result?.quiz_id ?? result?.quizId ?? result?.quiz ?? result?.game_id;

  const category = percentToCategory(percentage);

  const correctCount = useMemo(() => {
    const v =
      result?.correct_answers ??
      result?.correctAnswers ??
      result?.num_correct ??
      result?.correct_count;
    if (v != null) return Number(v);

    // Fallback: derived from per-question review if present
    const perQ =
      result?.questions ??
      result?.question_results ??
      result?.review ??
      result?.per_question;
    if (Array.isArray(perQ)) {
      const mapped = perQ.map((q) => q);
      const count = mapped.filter((q) => {
        const isCorrect =
          q?.is_correct ?? q?.correct ?? q?.correct_answer ?? q?.user_answer_correct;
        if (typeof isCorrect === "boolean") return isCorrect;
        if (isCorrect == null) return false;
        return String(isCorrect).toLowerCase() === "true" || String(isCorrect) === "1";
      }).length;
      return count;
    }

    return null;
  }, [result]);

  const wrongCount = useMemo(() => {
    const v =
      result?.wrong_answers ??
      result?.wrongAnswers ??
      result?.num_wrong ??
      result?.wrong_count;
    if (v != null) return Number(v);
    if (correctCount != null && totalQuestions != null) return Number(totalQuestions) - Number(correctCount);
    return null;
  }, [result, correctCount, totalQuestions]);

  const timeTaken = result?.time_taken ?? result?.timeTaken ?? result?.duration ?? result?.elapsed_time;

  const reviewList =
    result?.questions ??
    result?.question_results ??
    result?.review ??
    result?.per_question ??
    result?.questionReview;

  const questionReview = Array.isArray(reviewList)
    ? reviewList
    : [];

  // Accordion state
  const [openIndex, setOpenIndex] = useState(0);
  useEffect(() => {
    if (questionReview.length > 0) setOpenIndex(0);
  }, [questionReview.length]);

  const timeBadge = formatSeconds(timeTaken);


  const scoreTone =
    category.color === "success"
      ? "success"
      : category.color === "primary"
        ? "primary"
        : category.color === "warning"
          ? "warning"
          : category.color === "danger"
            ? "danger"
            : "neutral";

  // Derived charts data
  const pieData = [
    { name: "Correct", value: correctCount ?? 0, fill: "#34d399" },
    { name: "Incorrect", value: wrongCount ?? 0, fill: "#f87171" },
  ];

  const barData = questionReview.map((q, idx) => {
    const isCorrect =
      typeof q?.is_correct === "boolean"
        ? q.is_correct
        : q?.is_correct == null
          ? false
          : String(q.is_correct).toLowerCase() === "true" || String(q.is_correct) === "1";

    const marksEarned = isCorrect ? Number(q?.marks ?? q?.max_marks ?? q?.marks_earned ?? q?.earned_marks ?? 0) : 0;

    return {
      label: `Q${idx + 1}`,
      score: Number.isFinite(marksEarned) ? marksEarned : 0,
    };
  });

  const tableRows = questionReview.map((q, idx) => {
    const isCorrectRaw = q?.is_correct ?? q?.correct ?? q?.user_answer_correct ?? q?.correct_flag;
    const isCorrect =
      typeof isCorrectRaw === "boolean"
        ? isCorrectRaw
        : isCorrectRaw == null
          ? null
          : String(isCorrectRaw).toLowerCase() === "true" || String(isCorrectRaw) === "1";

    const earned = q?.marks_earned ?? q?.marks ?? q?.earned_marks ?? q?.user_marks ?? q?.score;
    const maxMarks = q?.max_marks ?? q?.total_marks ?? q?.marks_possible ?? 1;

    const marksEarned = q?.is_correct
      ? Number(q?.marks ?? q?.max_marks ?? q?.marks_earned ?? 0)
      : 0;

    return {
      label: `Q${idx + 1}`,
      result: isCorrect ? "✓" : "✗",
      marks: `${marksEarned ?? 0} / ${maxMarks ?? 1}`,
    };
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {loading ? (
          <div className="flex items-center gap-3 py-10">
            <LoadingSpinner />
            <h2 className="text-lg font-semibold text-white">Loading result...</h2>
          </div>
        ) : error ? (
          <div className="py-10">
            <h2 className="text-lg font-semibold text-red-400">{error}</h2>
          </div>
        ) : requiredResultMissing ? (
          <div className="py-10">
            <h2 className="text-lg font-semibold text-red-400">Required result data missing.</h2>
          </div>
        ) : (
          <>

            {/* SECTION 1 - Score Overview */}
            <Card className="p-6" bordered shadow>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20">
                      <Award className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-white">Quiz Complete!</h1>
                      <p className="text-sm text-slate-400">Here is how you performed</p>
                    </div>
                    {percentage != null ? (
                      <ScoreToneBadge percentage={percentage} />
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Quiz Title</div>
                    <div className="text-xl font-semibold text-white">
                      {result?.quiz_title}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-800/50 p-3">
                      <div className="text-xs text-slate-500">Score</div>
                      <div className="mt-1 text-lg font-bold text-white">{score}</div>
                    </div>
                    <div className="rounded-xl bg-slate-800/50 p-3">
                      <div className="text-xs text-slate-500">Percentage</div>
                      <div className="mt-1 text-lg font-bold text-white">{percentage != null ? `${percentage}%` : ""}</div>
                    </div>
                    <div className="rounded-xl bg-slate-800/50 p-3">
                      <div className="text-xs text-slate-500">Questions</div>
                      <div className="mt-1 text-lg font-bold text-white">{totalQuestions}</div>
                    </div>
                    <div className="rounded-xl bg-slate-800/50 p-3">
                      <div className="text-xs text-slate-500">Correct</div>
                      <div className="mt-1 text-lg font-bold text-emerald-400">{correctCount}</div>
                    </div>
                    <div className="rounded-xl bg-slate-800/50 p-3">
                      <div className="text-xs text-slate-500">Incorrect</div>
                      <div className="mt-1 text-lg font-bold text-red-400">{wrongCount}</div>
                    </div>
                    <div className="rounded-xl bg-slate-800/50 p-3">
                      <div className="text-xs text-slate-500">Time</div>
                      <div className="mt-1 text-lg font-bold text-white">{timeBadge}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:justify-end">
                  <CircularProgress percentage={percentage} tone={scoreTone} />
                </div>
              </div>
            </Card>

            {/* SECTION 2 - Stats Grid */}
            <section>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Correct"
                  value={correctCount ?? "N/A"}
                  subtitle="Total correct"
                  icon={CheckCircle}
                  iconColor="emerald"
                />
                <StatCard
                  title="Incorrect"
                  value={wrongCount}
                  subtitle="Total wrong"
                  icon={XCircle}
                  iconColor="rose"
                />
                <StatCard
                  title="Accuracy"
                  value={percentage != null ? `${percentage}%` : "N/A"}
                  subtitle="Your score"
                  icon={Target}
                  iconColor="indigo"
                />
                <StatCard
                  title="Duration"
                  value={timeBadge}
                  subtitle="Time taken"
                  icon={Clock}
                  iconColor="amber"
                />
              </div>
            </section>

            {/* SECTION 3 - Question Review */}
            <section className="space-y-4">
              <SectionHeader
                title="Question Review"
                description="Expand each question to see your answers and marks earned"
                icon={BarChart3}
              />

              <div className="space-y-3">
                {questionReview.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p className="text-slate-400">No question review data available.</p>
                  </Card>
                ) : (
                  questionReview.map((q, idx) => {
                    const isCorrectRaw = q?.is_correct ?? q?.correct ?? q?.user_answer_correct;
                    const isCorrect =
                      typeof isCorrectRaw === "boolean"
                        ? isCorrectRaw
                        : isCorrectRaw == null
                          ? null
                          : String(isCorrectRaw).toLowerCase() === "true" || String(isCorrectRaw) === "1";

                    const questionText = q?.question_text ?? q?.question ?? q?.text ?? q?.stem;

                    const optionList = Array.isArray(q?.options) ? q.options : null;

                    // API fields per option object:
                    // options: [{ id, option_text, is_correct }]
                    const selectedOptionId = q?.selected_option_id ?? q?.selectedOptionId ?? q?.user_selected_option_id;
                    const correctOptionId = q?.correct_option_id ?? q?.correctOptionId;

                    const selectedOption =
                      optionList?.find((o) => o?.id === selectedOptionId) ?? null;
                    const correctOption =
                      optionList?.find((o) => o?.id === correctOptionId) ?? null;

                    const userAnswerText = selectedOption?.option_text;
                    const correctAnswerText = correctOption?.option_text;

                    const maxMarks = q?.max_marks ?? q?.total_marks ?? q?.marks_possible ?? 1;
                    const marksEarned = q?.is_correct ? Number(q?.marks ?? q?.max_marks ?? q?.marks_earned ?? 0) : 0;

                    const badgeVariant = isCorrect == null ? "neutral" : isCorrect ? "success" : "danger";

                    const resolvedOptions = optionList ? optionList : [];

                    const optionLabels = ["A", "B", "C", "D"];

                    return (
                      <Card
                        key={idx}
                        className="overflow-hidden"
                        padding="none"
                      >
                        <button
                          className="w-full p-4 text-left"
                          onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={[
                                "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
                                isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                              ].join(" ")}>
                                {idx + 1}
                              </div>
                              <div className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-none">
                                {questionText ?? "Untitled Question"}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge variant={badgeVariant} size="sm">
                                {isCorrect == null ? "" : isCorrect ? "Correct" : "Wrong"}
                              </Badge>
                              <span className="text-xs text-slate-500">{openIndex === idx ? "▲" : "▼"}</span>
                            </div>
                          </div>
                        </button>

                        {openIndex === idx && (
                          <div className="border-t border-slate-700/50 p-4 space-y-4">
                            <div className="rounded-xl bg-slate-800/50 p-4">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Question</div>
                              <div className="text-sm text-white">{questionText ?? "N/A"}</div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <div className="rounded-xl bg-slate-800/50 p-3">
                                <div className="text-xs text-slate-500 mb-1">Your Answer</div>
                                <div className="text-sm text-white">{userAnswerText ?? "No answer"}</div>
                              </div>
                              <div className="rounded-xl bg-emerald-500/10 p-3">
                                <div className="text-xs text-emerald-500 mb-1">Correct Answer</div>
                                <div className="text-sm text-emerald-400">{correctAnswerText ?? "N/A"}</div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">All Options</div>
                              <div className="grid grid-cols-1 gap-2">
                                {resolvedOptions.map((opt, optIdx) => {
                                  const label = optionLabels[optIdx];
                                  const optText = opt?.option_text ?? opt?.text ?? opt?.option ?? opt?.value;

                                  const isCorrectOption = opt?.id != null && correctOption?.id != null
                                    ? opt.id === correctOption.id
                                    : correctAnswerText != null
                                      ? String(correctAnswerText) === String(optText)
                                      : false;

                                  const isUserSelected = opt?.id != null && selectedOption?.id != null
                                    ? opt.id === selectedOption.id
                                    : selectedOption?.option_text != null
                                      ? String(selectedOption.option_text) === String(optText)
                                      : false;

                                  return (
                                    <div
                                      key={label}
                                      className={[
                                        "flex items-center gap-3 rounded-lg border px-3 py-2",
                                        isCorrectOption
                                          ? "border-emerald-500/50 bg-emerald-500/10"
                                          : isUserSelected
                                            ? "border-red-500/50 bg-red-500/10"
                                            : "border-slate-700 bg-slate-800/30"
                                      ].join(" ")}
                                    >
                                      <div className={[
                                        "flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
                                        isCorrectOption
                                          ? "bg-emerald-500 text-white"
                                          : isUserSelected
                                            ? "bg-red-500 text-white"
                                            : "bg-slate-700 text-slate-300"
                                      ].join(" ")}>
                                        {label}
                                      </div>
                                      <span className="text-sm text-slate-200 flex-1">{optText ?? "N/A"}</span>
                                      {isCorrectOption && <Badge variant="success" size="sm">Correct</Badge>}
                                      {isUserSelected && !isCorrectOption && <Badge variant="danger" size="sm">Your Answer</Badge>}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                              <div>
                                <div className="text-xs text-slate-500">Marks Earned</div>
                                <div className="text-xl font-bold text-white">
                                  {`${marksEarned ?? 0} / ${maxMarks ?? 1}`}
                                </div>
                              </div>
                              <Badge variant={isCorrect ? "success" : "danger"} size="lg">
                                {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })
                )}
              </div>
            </section>

            {/* SECTION 4 - Table */}
            <section>
              <SectionHeader
                title="Question Summary"
                description="Quick overview of your answers"
                icon={TrendingUp}
              />

              <Card padding="none" className="mt-4 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="bg-slate-800/50">
                      <tr className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        <th className="px-4 py-3">Question</th>
                        <th className="px-4 py-3">Result</th>
                        <th className="px-4 py-3">Marks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {tableRows.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                            No table data available.
                          </td>
                        </tr>
                      ) : (
                        tableRows.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-4 py-3 text-white font-medium">{row.label}</td>
                            <td className="px-4 py-3">
                              {row.result === "✓" ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                                  <CheckCircle className="h-4 w-4" /> Correct
                                </span>
                              ) : row.result === "✗" ? (
                                <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
                                  <XCircle className="h-4 w-4" /> Incorrect
                                </span>
                              ) : (
                                <span className="text-slate-400">{row.result}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-300">{row.marks}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>

            {/* SECTION 5 - Charts */}
            <section>
              <SectionHeader
                title="Performance Charts"
                description="Visual breakdown of your quiz performance"
              />

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mt-4">
                <Card padding="md" bordered>
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-white">Correct vs Incorrect</h3>
                  </div>

                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          innerRadius={40}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {pieData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                      <span className="text-xs text-slate-400">Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <span className="text-xs text-slate-400">Incorrect</span>
                    </div>
                  </div>
                </Card>

                <div className="lg:col-span-2">
                  <Card padding="md" bordered>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-white">Score per Question</h3>
                      <p className="text-xs text-slate-500">Marks earned for each question</p>
                    </div>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                          <XAxis
                            dataKey="label"
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            axisLine={{ stroke: '#334155' }}
                          />
                          <YAxis
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            axisLine={{ stroke: '#334155' }}
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1e293b',
                              border: '1px solid #334155',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* SECTION 6 - Action Buttons */}
            <section className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="primary"
                className="flex-1"
                onClick={() => navigate("/join-quiz")}
                disabled={loading}
                icon={RotateCcw}
              >
                Retake Quiz
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="flex-1"
                onClick={() => navigate("/leaderboard")}
                disabled={loading}
                icon={BarChart3}
              >
                Leaderboard
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/my-performance")}
                disabled={loading}
                icon={TrendingUp}
              >
                My Performance
              </Button>

              <Button
                size="lg"
                variant="ghost"
                className="flex-1"
                onClick={() => navigate("/profile")}
                disabled={loading}
                icon={Home}
              >
                Home
              </Button>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default ResultPage;



