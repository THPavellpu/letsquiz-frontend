import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { BarChart3, Users, Trophy, TrendingDown, TrendingUp, Target } from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SectionHeader from "../../components/ui/SectionHeader";
import { getAnalytics } from "../../api/quizApi";

function Analytics() {
    const { quizId } = useParams();

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadAnalytics() {
            setLoading(true);
            setError("");

            try {
                const response = await getAnalytics(quizId);
                if (!isMounted) return;
                setAnalytics(response.data);
            } catch (err) {
                if (!isMounted) return;
                setError(JSON.stringify(err?.response?.data || err?.message || err));
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (quizId) loadAnalytics();
        else {
            setLoading(false);
            setError("Missing quizId.");
        }

        return () => {
            isMounted = false;
        };
    }, [quizId]);

    const quizTitle =
        analytics?.quiz_title ??
        analytics?.quizTitle ??
        analytics?.title ??
        "";

    const overall = analytics?.overall_statistics ?? analytics ?? {};

    const totalParticipants = overall.total_participants ?? overall.totalParticipants ?? overall.total_participants_count;
    const completedParticipants = overall.completed_participants ?? overall.completedParticipants ?? overall.completed_participants_count;
    const highestScore = overall.highest_score ?? overall.highestScore ?? overall.highest;
    const lowestScore = overall.lowest_score ?? overall.lowestScore ?? overall.lowest;
    const averageScore = overall.average_score ?? overall.averageScore ?? overall.average;

    const questionAnalytics = analytics?.question_analytics ?? [];

    const barData = useMemo(() => {
        return (questionAnalytics || [])
            .map((q, idx) => {
                const question = q.question_text ?? q.question ?? q.text ?? q.prompt ?? `Q${idx + 1}`;
                const correct = q.correct ?? q.correct_count ?? q.right;
                const totalAttempts = q.total_attempts ?? q.totalAttempts ?? q.attempts;
                const rawAccuracy = q.accuracy ?? q.accuracy_percent ?? (totalAttempts != null && correct != null ? Math.round((Number(correct) / Number(totalAttempts)) * 100) : null);
                const accuracyNum = rawAccuracy == null ? null : Number(rawAccuracy);
                if (accuracyNum == null || Number.isNaN(accuracyNum)) return null;
                return { name: `Q${idx + 1}`, fullQuestion: String(question), accuracy: Math.max(0, Math.min(100, accuracyNum)) };
            })
            .filter(Boolean);
    }, [questionAnalytics]);

    const pieData = useMemo(() => {
        const counts = new Map();
        for (const q of questionAnalytics || []) {
            const difficulty = q.difficulty ?? q.level;
            if (difficulty == null || difficulty === "") continue;
            const key = String(difficulty);
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        return Array.from(counts.entries()).map(([difficulty, count]) => ({ difficulty, count })).sort((a, b) => b.count - a.count);
    }, [questionAnalytics]);

    const difficultyColors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

    if (loading) {
        return (
            <div className="space-y-6">
                <SectionHeader title="Quiz Analytics" description="View performance metrics and question statistics" icon={BarChart3} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[1,2,3,4,5].map(i => <Card key={i} className="h-24 animate-pulse" />)}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="py-10 text-red-400">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <SectionHeader title="Quiz Analytics" description="View performance metrics and question statistics" icon={BarChart3} />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <Card padding="md" className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                            <Users className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Total</div>
                            <div className="text-xl font-bold text-white">{totalParticipants ?? 0}</div>
                        </div>
                    </div>
                </Card>
                <Card padding="md" className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                            <Trophy className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Completed</div>
                            <div className="text-xl font-bold text-white">{completedParticipants ?? 0}</div>
                        </div>
                    </div>
                </Card>
                <Card padding="md" className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
                            <TrendingUp className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Highest</div>
                            <div className="text-xl font-bold text-white">{highestScore ?? "N/A"}</div>
                        </div>
                    </div>
                </Card>
                <Card padding="md" className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20">
                            <TrendingDown className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Lowest</div>
                            <div className="text-xl font-bold text-white">{lowestScore ?? "N/A"}</div>
                        </div>
                    </div>
                </Card>
                <Card padding="md" className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20">
                            <Target className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Average</div>
                            <div className="text-xl font-bold text-white">{averageScore ?? "N/A"}</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <Card padding="lg">
                    <div className="mb-4">
                        <h3 className="text-base font-semibold text-white">Question Accuracy</h3>
                        <p className="text-xs text-slate-500">Accuracy percentage per question</p>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
                                <XAxis dataKey="name" interval={0} angle={-35} textAnchor="end" height={70} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} />
                                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} />
                                <Tooltip formatter={(v, name, props) => [`${v}%`, props?.payload?.fullQuestion || "Accuracy"]} contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }} labelStyle={{ color: "#f1f5f9" }} />
                                <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                                    {barData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? "#6366f1" : "#818cf8"} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {barData.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No accuracy data available</p>}
                </Card>

                <Card padding="lg">
                    <div className="mb-4">
                        <h3 className="text-base font-semibold text-white">Difficulty Distribution</h3>
                        <p className="text-xs text-slate-500">Questions grouped by difficulty level</p>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="h-56 w-full sm:h-64 sm:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip formatter={(v, name) => [v, name === "count" ? "Questions" : name]} contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }} />
                                    <Pie data={pieData} dataKey="count" nameKey="difficulty" outerRadius="75%" label={({ difficulty, percent }) => difficulty ? `${difficulty}` : ""}>
                                        {pieData.map((entry, idx) => <Cell key={entry.difficulty} fill={difficultyColors[idx % difficultyColors.length]} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full sm:w-1/2 space-y-2">
                            {pieData.length === 0 ? <p className="text-sm text-slate-500">No difficulty data</p> : pieData.map((d, idx) => (
                                <div key={d.difficulty} className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: difficultyColors[idx % difficultyColors.length] }} />
                                        <span className="text-sm text-slate-300 capitalize">{d.difficulty}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-white">{d.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Table */}
            <Card padding="lg">
                <div className="mb-4">
                    <h3 className="text-base font-semibold text-white">Question Details</h3>
                    <p className="text-xs text-slate-500">Per-question breakdown</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Question</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Correct</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Wrong</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Accuracy</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Difficulty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {questionAnalytics.map((q, idx) => {
                                const question = q.question_text ?? q.question ?? q.text ?? q.prompt;
                                const correct = q.correct ?? q.correct_count ?? q.right;
                                const wrong = q.wrong ?? q.wrong_count ?? q.wrong_count;
                                const accuracy = q.accuracy ?? q.accuracy_percent ?? (q.total_attempts != null && q.correct != null ? Math.round((Number(q.correct) / Number(q.total_attempts)) * 100) : null);
                                const difficulty = q.difficulty ?? q.level;
                                const accuracyDisplay = accuracy == null ? "N/A" : `${Number(accuracy)}%`;
                                return (
                                    <tr key={q.id ?? idx} className="hover:bg-slate-800/30">
                                        <td className="py-3 pr-4 text-sm text-slate-300 max-w-xs truncate">{question ?? "N/A"}</td>
                                        <td className="py-3 pr-4 text-sm text-emerald-400">{correct ?? "N/A"}</td>
                                        <td className="py-3 pr-4 text-sm text-red-400">{wrong ?? "N/A"}</td>
                                        <td className="py-3 pr-4 text-sm">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${Number(accuracy) >= 70 ? 'bg-emerald-500/20 text-emerald-300' : Number(accuracy) >= 40 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>
                                                {accuracyDisplay}
                                            </span>
                                        </td>
                                        <td className="py-3 text-sm">
                                            <Badge variant={difficulty === "easy" ? "success" : difficulty === "medium" ? "warning" : "danger"} size="sm">
                                                {difficulty ?? "N/A"}
                                            </Badge>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

export default Analytics;

