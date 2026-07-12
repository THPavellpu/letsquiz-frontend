import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Trophy,
  Users,
  FileQuestion,
  Calendar,
  ArrowRight
} from "lucide-react";

import { getCreatorDashboard } from "../../api/quizApi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import SectionHeader from "../../components/ui/SectionHeader";
import { formatDateTime } from "../../utils/dateUtils";

function Dashboard() {
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

    fetchCreatorDashboard();

    return () => {
      isMounted = false;
    };
  }, [quizId]);

  const hasQuizzes = useMemo(() => Array.isArray(quizzes) && quizzes.length > 0, [quizzes]);

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Creator Dashboard"
          description="Manage your quizzes and view analytics"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64 animate-pulse" />
          ))}
        </div>
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
      <EmptyState
        icon={LayoutDashboard}
        title="No quizzes yet"
        description="Create your first quiz to get started. You can create manual quizzes or use AI to generate questions automatically."
        action={{
          label: "Create Quiz",
          onClick: () => navigate("/create-quiz"),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Creator Dashboard"
        description="Manage your quizzes and view analytics"
        icon={LayoutDashboard}
      />

      <section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => {
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
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
              >
                <Card
                  bordered
                  hover
                  className="h-full flex flex-col justify-between"
                  padding="lg"
                >
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-slate-500">Quiz Title</div>
                      <div className="text-base font-semibold text-white truncate">{title || "Untitled Quiz"}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-medium text-slate-500">Quiz Code</div>
                      <div className="text-sm font-mono text-indigo-400">{code || "N/A"}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50">
                          <FileQuestion className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Questions</div>
                          <div className="text-sm font-semibold text-white">{questions ?? 0}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50">
                          <Users className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Participants</div>
                          <div className="text-sm font-semibold text-white">{participants ?? 0}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50">
                          <Trophy className="h-4 w-4 text-amber-400" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Highest Score</div>
                          <div className="text-sm font-semibold text-white">{highestScore ?? "N/A"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50">
                          <BarChart3 className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Average Score</div>
                          <div className="text-sm font-semibold text-white">{averageScore ?? "N/A"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {createdDate ? (
                        <>
                          {formatDateTime(createdDate).date}
                          <span className="text-slate-600">{formatDateTime(createdDate).time}</span>
                        </>
                      ) : "N/A"}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Button size="sm" variant="primary" onClick={() => navigate(`/add-question/${id}`)}>
                      <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                      Questions
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/quiz-summary/${id}`)}>
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/analytics/${id}`)}>
                      <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                      Analytics
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/leaderboard/${id}`)}>
                      <Trophy className="h-3.5 w-3.5 mr-1.5" />
                      Leaderboard
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;


