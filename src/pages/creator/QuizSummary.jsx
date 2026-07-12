import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getQuizSummary } from "../../api/quizApi";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { formatDateTime } from "../../utils/dateUtils";

function QuizSummary() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  useAuth();

  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const response = await getQuizSummary(quizId);
        setSummary(response?.data ?? null);
      } catch (err) {
        setError(JSON.stringify(err?.response?.data || err?.message || err));
      } finally {
        setIsLoading(false);
      }
    }

    if (quizId) load();
  }, [quizId]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(t);
  }, [message]);

  const navActions = useMemo(() => {
    return {
      addMore: () => navigate(`/add-question/${quizId}`),
      dashboard: () => navigate(`/dashboard/${quizId}`),
      analytics: () => navigate(`/analytics/${quizId}`),
      leaderboard: () => navigate(`/leaderboard/${quizId}`),
      home: () => navigate("/profile"),
    };
  }, [navigate, quizId]);

  async function handleCopyCode() {
    try {
      if (!summary?.quiz_code) return;
      await navigator.clipboard.writeText(summary.quiz_code);
      setMessage("Quiz code copied successfully.");
    } catch (e) {
      setError("Failed to copy quiz code.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
<h1 className="text-2xl font-bold tracking-tight text-white dark:text-white">Quiz Summary</h1>
<p className="mt-1 text-sm text-slate-400">
          Published quiz details and join code.
        </p>
      </div>

      {isLoading ? (
        <Card padding="lg" className="flex items-center justify-center">
          <LoadingSpinner size={28} />
        </Card>
      ) : null}

      {error ? (
        <Card padding="lg" className="border-red-200 bg-red-50 text-red-800">
          {error}
        </Card>
      ) : null}

      {summary ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-white dark:bg-gray-800" padding="lg" shadow={true}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:ring-emerald-800">
                      <span aria-hidden="true" className="text-lg">🎉</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-emerald-400">Published</div>
                      <div className="text-2xl font-bold text-white">Quiz Created Successfully</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant="success">Published</Badge>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-xs text-slate-400">Quiz Code</div>
                  <div className="mt-1 flex items-center justify-start gap-3 sm:justify-end">
                    <div className="rounded-xl bg-slate-700 px-4 py-3 text-2xl font-extrabold tracking-widest text-white ring-1 ring-slate-600">
                      {summary.quiz_code}
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleCopyCode}
                    >
                      Copy Code
                    </Button>
                  </div>
                </div>
              </div>

              {message ? (
                <div
                  className="mt-4 rounded-xl border border-emerald-800 bg-emerald-900/50 px-4 py-3 text-sm font-medium text-emerald-200"
                  role="status"
                >
                  <span className="mr-2 inline-flex h-2 w-2 items-center justify-center rounded-full bg-emerald-500" />
                  {message}
                </div>
              ) : null}

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-medium text-slate-400">Quiz Title</div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    {summary.quiz_title}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400">Creator</div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    {summary.creator}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400">Created Date</div>
                  <div className="mt-1 text-sm font-medium text-white">
                    {summary.created_date ? (
                        <>
                            {formatDateTime(summary.created_date).date}
                            <br />
                            <span className="text-slate-400">{formatDateTime(summary.created_date).time}</span>
                        </>
                    ) : "N/A"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400">Questions Added</div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    {summary.questions_added}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400">Total Marks</div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    {summary.total_marks}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400">Average Marks Per Question</div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    {summary.average_marks_per_question}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-slate-400">
                Participants join using this code.
              </div>
            </Card>

            <Card padding="lg" shadow={true}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Next steps</div>
                  <div className="mt-1 text-sm text-slate-400">Manage your quiz and analytics.</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button size="lg" variant="primary" onClick={navActions.addMore}>
                  Add More Questions
                </Button>
                <Button size="lg" variant="secondary" onClick={navActions.dashboard}>
                  View Dashboard
                </Button>
                <Button size="lg" variant="secondary" onClick={navActions.analytics}>
                  View Analytics
                </Button>
                <Button size="lg" variant="secondary" onClick={navActions.leaderboard}>
                  View Leaderboard
                </Button>
                <div className="sm:col-span-2">
                  <Button size="lg" variant="ghost" className="w-full" onClick={navActions.home}>
                    Go Home
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg" shadow={true}>
              <div className="text-sm font-semibold text-white">Recent Participants</div>
              <div className="mt-2 text-sm text-slate-400">Coming soon</div>
            </Card>

            <Card padding="lg" shadow={true}>
              <div className="text-sm font-semibold text-white">Live Participants</div>
              <div className="mt-2 text-sm text-slate-400">Coming soon</div>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default QuizSummary;

