import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyPerformance } from "../../api/quizApi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { formatDateTime } from "../../utils/dateUtils";

function MyPerformance() {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchMyPerformance() {
      try {
        setLoading(true);
        setError("");

        const response = await getMyPerformance();
        const data = response?.data;

        // Support multiple possible backend response shapes.
        const list =
          Array.isArray(data)
            ? data
            : data?.attempts
              ? data.attempts
              : data?.results
                ? data.results
                : [];

        if (isMounted) setAttempts(list);
      } catch (err) {
        if (!isMounted) return;
        setError(JSON.stringify(err?.response?.data || err?.message || err));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchMyPerformance();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasAttempts = useMemo(() => Array.isArray(attempts) && attempts.length > 0, [attempts]);

  // Helper to format date using the shared utility
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const { date, time } = formatDateTime(dateString);
    if (date === "N/A") return "N/A";
    return `${date} ${time}`;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-10">
        <LoadingSpinner />
        <h2 className="text-lg font-semibold">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10">
        <h2 className="text-lg font-semibold">{error}</h2>
      </div>
    );
  }

  if (!hasAttempts) {
    return (
      <div className="space-y-6 py-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Performance 📈</h1>
          <p className="mt-2 text-sm text-slate-400">You haven't attempted any quizzes yet.</p>
        </div>
        <div>
          <Button variant="primary" onClick={() => navigate("/join-quiz")}>
            Join Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2 animate-[fadeIn_220ms_ease-out]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              My Performance
              <span className="ml-2" aria-hidden>
                📈
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              View all your quiz attempts and scores.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button variant="ghost" onClick={() => navigate("/profile")}>
              Go Home
            </Button>
          </div>
        </div>
      </header>

      <section className="animate-[fadeIn_260ms_ease-out]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {attempts.map((attempt) => {
            const id = attempt.id ?? attempt.attempt_id ?? attempt.attemptId;
            const title = attempt.quiz_title ?? attempt.title ?? attempt.name ?? "Unknown Quiz";
            const score = attempt.score ?? attempt.total_score;
            const percentage = attempt.percentage ?? attempt.percent;
            const completed = attempt.completed ?? attempt.is_completed;
            const startedAt = attempt.started_at ?? attempt.startedAt ?? attempt.created_at;
            const finishedAt = attempt.finished_at ?? attempt.finishedAt ?? attempt.completed_at;

            return (
              <Card
                key={id}
                bordered
                className="p-5 h-full flex flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-md"
                padding="none"
              >
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-sm text-slate-400">Quiz Title</div>
                    <div className="text-lg font-semibold text-white">{title}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-slate-400">Score</div>
                      <div className="mt-1 text-sm font-semibold text-white">{score ?? "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Percentage</div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        {percentage !== undefined ? `${percentage}%` : "N/A"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400">Completed</div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        {completed === true || completed === "true" ? "Yes" : "No"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Started At</div>
                      <div className="mt-1 text-sm font-semibold text-white">{formatDate(startedAt)}</div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-xs text-slate-400">Finished At</div>
                      <div className="mt-1 text-sm font-semibold text-white">{formatDate(finishedAt)}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full"
                    disabled={!id}
                    onClick={() => {
                      if (!id) return;
                      navigate(`/results/${id}`);
                    }}
                  >
                    View Result
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default MyPerformance;