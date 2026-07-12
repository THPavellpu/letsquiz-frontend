import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  LogIn,
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Award
} from "lucide-react";

import { getMyPerformance } from "../../api/quizApi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import SectionHeader from "../../components/ui/SectionHeader";
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const { date, time } = formatDateTime(dateString);
    if (date === "N/A") return "N/A";
    return `${date} ${time}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="My Performance"
          description="View all your quiz attempts and scores"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-56 animate-pulse" />
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

  if (!hasAttempts) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No quiz attempts yet"
        description="Join a quiz to see your performance history and results."
        action={{
          label: "Join Quiz",
          onClick: () => navigate("/join-quiz"),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Performance"
        description="View all your quiz attempts and scores"
        icon={BarChart3}
      />

      <section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {attempts.map((attempt, index) => {
            const id = attempt.id ?? attempt.attempt_id ?? attempt.attemptId;
            const title = attempt.quiz_title ?? attempt.title ?? attempt.name ?? "Unknown Quiz";
            const score = attempt.score ?? attempt.total_score;
            const percentage = attempt.percentage ?? attempt.percent;
            const completed = attempt.completed ?? attempt.is_completed;
            const startedAt = attempt.started_at ?? attempt.startedAt ?? attempt.created_at;
            const finishedAt = attempt.finished_at ?? attempt.finishedAt ?? attempt.completed_at;

            const isCompleted = completed === true || completed === "true";
            const passThreshold = 50;
            const isPassed = percentage !== undefined && percentage >= passThreshold;

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
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-500">Quiz</div>
                        <div className="text-base font-semibold text-white truncate mt-0.5">
                          {title}
                        </div>
                      </div>
                      <Badge
                        variant={isCompleted ? (isPassed ? "success" : "danger") : "warning"}
                        size="sm"
                      >
                        {isCompleted ? (isPassed ? "Passed" : "Failed") : "In Progress"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20">
                          <Award className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Score</div>
                          <div className="text-sm font-semibold text-white">{score ?? "N/A"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isCompleted ? (isPassed ? 'bg-emerald-500/20' : 'bg-red-500/20') : 'bg-amber-500/20'
                        }`}>
                          {isCompleted ? (
                            isPassed ? <Trophy className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-red-400" />
                          ) : (
                            <Clock className="h-4 w-4 text-amber-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Percentage</div>
                          <div className="text-sm font-semibold text-white">
                            {percentage !== undefined ? `${percentage}%` : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {formatDate(finishedAt || startedAt)}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant={isCompleted ? "secondary" : "outline"}
                      className="w-full"
                      disabled={!id || !isCompleted}
                      onClick={() => {
                        if (!id) return;
                        navigate(`/results/${id}`);
                      }}
                    >
                      View Result
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
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

export default MyPerformance;