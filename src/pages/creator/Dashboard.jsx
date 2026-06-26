import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCreatorDashboard } from "../../api/quizApi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { formatDateTime } from "../../utils/dateUtils";

function Dashboard() {
  // Keep old param destructuring so /dashboard/:quizId links don't crash.
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCreatorDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await getCreatorDashboard();
        const data = response?.data;

        // Support a couple possible backend shapes without changing backend code.
        const list =
          Array.isArray(data)
            ? data
            : data?.quizzes
              ? data.quizzes
              : data?.results
                ? data.results
                : [];

        if (isMounted) setQuizzes(list);
      } catch (err) {
        if (!isMounted) return;
        setError(JSON.stringify(err?.response?.data || err?.message || err));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Always use creator endpoint for this page.
    fetchCreatorDashboard();

    return () => {
      isMounted = false;
    };
  }, [quizId]);

  const hasQuizzes = useMemo(() => Array.isArray(quizzes) && quizzes.length > 0, [quizzes]);

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

  if (!hasQuizzes) {
    return (
      <div className="space-y-6 py-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Creator Dashboard 📊</h1>
          <p className="mt-2 text-sm text-slate-400">You haven't created any quizzes yet.</p>
        </div>
        <div>
          <Button variant="primary" onClick={() => navigate("/create-quiz")}>
            Create Quiz
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
              Creator Dashboard
              <span className="ml-2" aria-hidden>
                📊
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your quizzes and view analytics.
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
          {quizzes.map((quiz) => {
            const id = quiz.id ?? quiz.quiz_id ?? quiz.quizId;
            const title = quiz.quiz_title ?? quiz.title ?? quiz.name ?? "";
            const code = quiz.quiz_code ?? quiz.code ?? "";

            const questions =
              quiz.questions ?? quiz.questions_count ?? quiz.question_count ?? quiz.total_questions;
            const participants = quiz.total_participants ?? quiz.participants ?? quiz.totalParticipants;
            const completedParticipants =
              quiz.completed_participants ?? quiz.completedParticipants;

            const highestScore = quiz.highest_score ?? quiz.highestScore;
            const averageScore = quiz.average_score ?? quiz.averageScore;

            const createdDate = quiz.created_date ?? quiz.createdDate ?? quiz.created_at ?? quiz.createdAt;

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
                    <div className="text-lg font-semibold text-white">{title || "N/A"}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-slate-400">Quiz Code</div>
                    <div className="text-sm font-mono text-white">{code || "N/A"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-slate-400">Questions</div>
                      <div className="mt-1 text-sm font-semibold text-white">{questions ?? "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Participants</div>
                      <div className="mt-1 text-sm font-semibold text-white">{participants ?? "N/A"}</div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400">Completed Participants</div>
                      <div className="mt-1 text-sm font-semibold text-white">{completedParticipants ?? "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Highest Score</div>
                      <div className="mt-1 text-sm font-semibold text-white">{highestScore ?? "N/A"}</div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400">Average Score</div>
                      <div className="mt-1 text-sm font-semibold text-white">{averageScore ?? "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Created Date</div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        {createdDate ? (
                            <>
                                {formatDateTime(createdDate).date}
                                <br />
                                <span className="text-slate-400">{formatDateTime(createdDate).time}</span>
                            </>
                        ) : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Button size="lg" variant="secondary" className="w-full" onClick={() => navigate(`/quiz-summary/${id}`)}>
                    View Dashboard
                  </Button>

                  <Button size="lg" variant="outline" className="w-full" onClick={() => navigate(`/analytics/${id}`)}>
                    Analytics
                  </Button>

                  <Button size="lg" variant="outline" className="w-full" onClick={() => navigate(`/leaderboard/${id}`)}>
                    Leaderboard
                  </Button>

                  <Button size="lg" variant="primary" className="w-full" onClick={() => navigate(`/add-question/${id}`)}>
                    Add More Questions
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

export default Dashboard;


