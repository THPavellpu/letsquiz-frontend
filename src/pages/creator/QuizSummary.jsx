import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  PartyPopper,
  PlusCircle,
  LayoutDashboard,
  BarChart3,
  Trophy,
  Home,
  Calendar,
  FileQuestion,
  Star,
  User
} from "lucide-react";

import { getQuizSummary } from "../../api/quizApi";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import SectionHeader from "../../components/ui/SectionHeader";
import { formatDateTime } from "../../utils/dateUtils";

function QuizSummary() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  useAuth();

  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
      setCopied(true);
      setMessage("Quiz code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError("Failed to copy quiz code.");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Quiz Summary"
          description="Published quiz details and join code"
        />
        <Card className="h-64 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10">
        <h2 className="text-lg font-semibold text-red-400">{error}</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Quiz Summary"
        description="Published quiz details and join code"
        icon={PartyPopper}
      />

      {summary && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-5">
            {/* Success Card */}
            <Card padding="lg">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20">
                    <PartyPopper className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <Badge variant="success" size="sm" className="mb-2">Published</Badge>
                    <h2 className="text-xl font-bold text-white">Quiz Created Successfully!</h2>
                    <p className="text-sm text-slate-400 mt-1">Share this code with participants to join</p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-xs font-medium text-slate-500 mb-2">Quiz Code</div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-slate-800 px-5 py-3 text-3xl font-bold tracking-widest text-indigo-400 border border-slate-700">
                        {summary.quiz_code}
                      </div>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={handleCopyCode}
                        className="h-full"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300"
                    role="status"
                  >
                    <Check className="h-4 w-4" />
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Quiz Details */}
            <Card padding="lg">
              <h3 className="text-base font-semibold text-white mb-5">Quiz Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                    <FileQuestion className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500">Quiz Title</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {summary.quiz_title || "Untitled Quiz"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/50">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500">Creator</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {summary.creator || "Unknown"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/50">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500">Created Date</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {summary.created_date ? (
                        <>
                          {formatDateTime(summary.created_date).date}
                          <span className="text-slate-500 ml-1">{formatDateTime(summary.created_date).time}</span>
                        </>
                      ) : "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                    <FileQuestion className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500">Questions Added</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {summary.questions_added ?? 0}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                    <Star className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500">Total Marks</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {summary.total_marks ?? 0}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                    <BarChart3 className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500">Avg. Marks/Question</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {summary.average_marks_per_question ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card padding="lg">
              <h3 className="text-base font-semibold text-white mb-5">Quick Actions</h3>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="primary" size="md" onClick={navActions.addMore}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Questions
                </Button>
                <Button variant="secondary" size="md" onClick={navActions.dashboard}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="outline" size="md" onClick={navActions.analytics}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" size="md" onClick={navActions.leaderboard}>
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboard
                </Button>
              </div>

              <Button variant="ghost" size="md" className="w-full mt-3" onClick={navActions.home}>
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <div className="text-sm font-semibold text-white">Recent Participants</div>
              </div>
              <p className="text-sm text-slate-500">Coming soon</p>
            </Card>

            <Card padding="lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50">
                  <Trophy className="h-4 w-4 text-slate-400" />
                </div>
                <div className="text-sm font-semibold text-white">Live Participants</div>
              </div>
              <p className="text-sm text-slate-500">Coming soon</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizSummary;

