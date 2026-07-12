import { useEffect, useMemo, useState } from "react";

import { useParams } from "react-router-dom";

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

import Card from "../../components/ui/Card";
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

    const totalParticipants =
        overall.total_participants ??
        overall.totalParticipants ??
        overall.total_participants_count;

    const completedParticipants =
        overall.completed_participants ??
        overall.completedParticipants ??
        overall.completed_participants_count;

    const highestScore =
        overall.highest_score ?? overall.highestScore ?? overall.highest;

    const lowestScore =
        overall.lowest_score ?? overall.lowestScore ?? overall.lowest;

    const averageScore =
        overall.average_score ?? overall.averageScore ?? overall.average;

    const questionAnalytics = analytics?.question_analytics ?? [];

    const barData = useMemo(() => {
        return (questionAnalytics || [])
            .map((q, idx) => {
                const question =
                    q.question_text ??
                    q.question ??
                    q.text ??
                    q.prompt ??
                    `Q${idx + 1}`;

                const correct = q.correct ?? q.correct_count ?? q.right;
                const totalAttempts =
                    q.total_attempts ?? q.totalAttempts ?? q.attempts;

                const rawAccuracy =
                    q.accuracy ??
                    q.accuracy_percent ??
                    (totalAttempts != null && correct != null
                        ? Math.round(
                              (Number(correct) / Number(totalAttempts)) * 100
                          )
                        : null);

                const accuracyNum = rawAccuracy == null ? null : Number(rawAccuracy);

                if (accuracyNum == null || Number.isNaN(accuracyNum)) return null;

                return {
                    // X-axis label: Q1, Q2, Q3...
                    name: `Q${idx + 1}`,
                    // Full question text for tooltip
                    fullQuestion: String(question),
                    accuracy: Math.max(0, Math.min(100, accuracyNum)),
                };
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

        return Array.from(counts.entries())
            .map(([difficulty, count]) => ({ difficulty, count }))
            .sort((a, b) => b.count - a.count);
    }, [questionAnalytics]);

    const difficultyColors = [
        "#2563eb", // blue-600
        "#16a34a", // green-600
        "#f59e0b", // amber-500
        "#dc2626", // red-600
        "#7c3aed", // violet-600
        "#0891b2", // cyan-600
        "#db2777", // fuchsia-600
    ];

    const rechartsBase = {
        tick: { fill: "#CBD5E1" },
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Quiz Analytics 📈</h1>

                {loading ? (
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">Loading...</div>
                ) : null}

                {!loading && error ? (
                    <div className="mt-2 text-sm text-red-600">{error}</div>
                ) : null}
            </div>

            {!loading && !error && (
                <>
                    <Card className="p-6" bordered shadow={false}>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="text-sm font-medium text-slate-400">Quiz Title</div>
                                <div className="mt-1 text-xl font-semibold text-slate-100">
                                    {quizTitle || "N/A"}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">Total Participants</div>
                                <div className="mt-1 text-lg font-semibold text-slate-100">{totalParticipants ?? "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">Completed Participants</div>
                                <div className="mt-1 text-lg font-semibold text-slate-100">{completedParticipants ?? "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">Highest Score</div>
                                <div className="mt-1 text-lg font-semibold text-slate-100">{highestScore ?? "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">Lowest Score</div>
                                <div className="mt-1 text-lg font-semibold text-slate-100">{lowestScore ?? "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">Average Score</div>
                                <div className="mt-1 text-lg font-semibold text-slate-100">{averageScore ?? "N/A"}</div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card bordered className="p-4 sm:p-6 bg-slate-800 border border-slate-700">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-sm font-medium text-slate-400">Question Accuracy</div>
                                    <div className="mt-1 text-lg font-semibold text-slate-100">Accuracy (%) per Question</div>
                                </div>
                            </div>

                            <div className="mt-4 h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
                                        <XAxis
                                            dataKey="name"
                                            interval={0}
                                            angle={-35}
                                            textAnchor="end"
                                            height={70}
                                            tick={{ fill: "#CBD5E1" }}
                                        />
                                        <YAxis
                                            domain={[0, 100]}
                                            tickFormatter={(v) => `${v}%`}
                                            tick={{ fill: "#CBD5E1" }}
                                        />
                                        <Tooltip
                                            formatter={(v, name, props) => {
                                                // Show full question text in tooltip label
                                                const fullQuestion = props?.payload?.fullQuestion;
                                                return [`${v}%`, fullQuestion ? `${fullQuestion}` : "Accuracy"];
                                            }}
                                            contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #475569" }}
                                            labelStyle={{ color: "#F1F5F9" }}
                                            itemStyle={{ color: "#F1F5F9" }}
                                        />
                                        <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                                            {barData.map((_, i) => (
                                                <Cell key={i} fill="#2563eb" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {barData.length === 0 ? (
                                <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                                    No accuracy data available.
                                </div>
                            ) : null}
                        </Card>

                        <Card bordered className="p-4 sm:p-6 bg-slate-800 border border-slate-700">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-sm font-medium text-slate-400">Difficulty Distribution</div>
                                    <div className="mt-1 text-lg font-semibold text-slate-100">Questions by Difficulty</div>
                                </div>
                            </div>

                            <div className="mt-2 flex h-80 flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="h-72 w-full sm:h-full sm:w-1/2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Tooltip
                                                formatter={(v, name) => [v, name === "count" ? "Questions" : name]}
                                                contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #475569" }}
                                                labelStyle={{ color: "#F1F5F9" }}
                                                itemStyle={{ color: "#F1F5F9" }}
                                            />
                                            <Pie
                                                data={pieData}
                                                dataKey="count"
                                                nameKey="difficulty"
                                                outerRadius="80%"
                                                label={({ difficulty, percent }) => {
                                                    if (!difficulty) return "";
                                                    return `${difficulty} (${Math.round((percent || 0) * 1)}%)`;
                                                }}
                                            >
                                                {pieData.map((entry, idx) => (
                                                    <Cell
                                                        key={entry.difficulty}
                                                        fill={difficultyColors[idx % difficultyColors.length]}
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="w-full sm:w-1/2">
                                    {pieData.length === 0 ? (
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            No difficulty data available.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {pieData.map((d, idx) => (
                                                <div
                                                    key={d.difficulty}
                                                    className="flex items-center justify-between gap-3"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="inline-block h-3 w-3 rounded"
                                                            style={{ background: difficultyColors[idx % difficultyColors.length] }}
                                                        />
                                                        <span className="text-sm text-slate-300">{d.difficulty}</span>
                                                    </div>
                                                    <div className="text-sm font-medium text-slate-100">{d.count}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card
                        bordered
                        className="p-4 sm:p-6 bg-slate-800 border border-slate-700"
                    >
                        <div>
                            <div className="text-sm font-medium text-slate-200">Analytics Table</div>
                            <div className="mt-1 text-lg font-semibold text-slate-100">Question-level Accuracy & Difficulty</div>
                        </div>

                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full table-auto border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-slate-700">
                                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-200">
                                            Question
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-200">
                                            Correct
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-200">
                                            Wrong
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-200">
                                            Accuracy
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-200">
                                            Difficulty
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questionAnalytics.map((q, idx) => {
                                        const question =
                                            q.question_text ??
                                            q.question ??
                                            q.text ??
                                            q.prompt;

                                        const correct = q.correct ?? q.correct_count ?? q.right;
                                        const wrong = q.wrong ?? q.wrong_count ?? q.wrong_count;

                                        const accuracy =
                                            q.accuracy ??
                                            q.accuracy_percent ??
                                            (q.total_attempts != null && q.correct != null
                                                ? Math.round(
                                                      (Number(q.correct) / Number(q.total_attempts)) * 100
                                                  )
                                                : null);

                                        const difficulty = q.difficulty ?? q.level;

                                        const accuracyDisplay = accuracy == null ? "N/A" : `${Number(accuracy)}%`;
                                        const correctDisplay = correct ?? "N/A";
                                        const wrongDisplay = wrong ?? "N/A";

                                        return (
                                            <tr
                                                key={q.id ?? `${idx}-${question}`}
                                                className="border-b border-slate-700 text-slate-300 hover:bg-slate-700"
                                            >
                                                <td className="px-3 py-3 align-top text-sm text-slate-300">{question ?? "N/A"}</td>
                                                <td className="px-3 py-3 align-top text-sm text-slate-300">{correctDisplay}</td>
                                                <td className="px-3 py-3 align-top text-sm text-slate-300">{wrongDisplay}</td>
                                                <td className="px-3 py-3 align-top text-sm text-slate-300">{accuracyDisplay}</td>
                                                <td className="px-3 py-3 align-top text-sm text-slate-300">{difficulty ?? "N/A"}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
}

export default Analytics;

