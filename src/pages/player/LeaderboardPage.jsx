import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getLeaderboard } from "../../api/quizApi";

function safeDecodeJwtPayload(token) {
    try {
        if (!token || typeof token !== "string") return null;
        const parts = token.split(".");
        if (parts.length < 2) return null;
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

function LeaderboardPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Highlight current user (best-effort, without breaking if token/user fields differ)
    const currentUser = useMemo(() => {
        const access = localStorage.getItem("access");
        const payload = safeDecodeJwtPayload(access);

        const userId =
            payload?.user_id ??
            payload?.userId ??
            payload?.id ??
            payload?.sub;

        const username =
            payload?.username ?? payload?.user_name ?? payload?.email ?? payload?.name;

        return { userId, username };
    }, []);

    useEffect(() => {
        let isMounted = true;
        let socket;

        async function load() {
            setLoading(true);
            setError("");

            try {
                const response = await getLeaderboard(quizId);
                if (!isMounted) return;

                setLeaderboard(
                    Array.isArray(response.data) ? response.data : []
                );
            } catch (err) {
                if (!isMounted) return;

                setError(
                    JSON.stringify(
                        err?.response?.data || err?.message || err
                    )
                );
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (quizId) {
            load();

            // Preserve real-time behavior (refetch on every websocket message)
            socket = new WebSocket(
                `ws://127.0.0.1:8000/ws/leaderboard/${quizId}/`
            );

            socket.onopen = () => {
                console.log("Leaderboard websocket connected");
            };

            socket.onclose = () => {
                console.log("Leaderboard websocket disconnected");
            };

            socket.onmessage = async () => {
                try {
                    const response = await getLeaderboard(quizId);
                    setLeaderboard(response.data);
                } catch (err) {
                    console.log(err);
                }
            };
        } else {
            setLoading(false);
            setError("Missing quizId.");
        }

        return () => {
            isMounted = false;
            if (socket) socket.close();
        };
    }, [quizId]);

    const normalized = useMemo(() => {
        return (Array.isArray(leaderboard) ? leaderboard : []).map((entry) => {
            const rank = Number(entry.rank ?? entry.position);
            const username =
                entry.username ?? entry.user ?? entry.participant;
            const userId = entry.user_id ?? entry.userId ?? entry.id ?? entry.user ?? entry.participant_id;
            const score = entry.score ?? entry.points;

            return {
                rank: Number.isFinite(rank) ? rank : undefined,
                username,
                userId,
                score,
                raw: entry,
            };
        });
    }, [leaderboard]);

    const topEmojiByRank = (rank) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return null;
    };

    const podium = normalized
        .filter((x) => x.rank >= 1 && x.rank <= 3)
        .sort((a, b) => a.rank - b.rank);

    const isCurrentUser = (entry) => {
        if (!currentUser?.userId && !currentUser?.username) return false;
        const usernameMatch =
            currentUser?.username &&
            String(entry.username ?? "").toLowerCase() ===
                String(currentUser.username).toLowerCase();
        const idMatch =
            currentUser?.userId != null &&
            entry.userId != null &&
            String(entry.userId) === String(currentUser.userId);
        return Boolean(usernameMatch || idMatch);
    };

    return (
        <div className="space-y-5">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Leaderboard
                    </h1>
<p className="mt-1 text-sm text-slate-300">
                        Live rankings for this quiz
                    </p>
                </div>

                <button
                    onClick={() => navigate("/profile")}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 active:translate-y-px"
                >
                    Go Home
                </button>
            </div>

            {loading && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
<h3 className="text-sm font-medium text-slate-300">Loading leaderboard...
                    </h3>
                </div>
            )}

            {!loading && error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/30">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                        {error}
                    </h3>
                </div>
            )}

            {!loading && !error && normalized.length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
<h3 className="text-sm font-medium text-slate-300">No participants yet.
                    </h3>
                </div>
            )}

            {!loading && !error && normalized.length > 0 && (
                <>
                    {/* Animated Podium */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-end justify-center gap-3 sm:gap-6">
                            {[1, 2, 3].map((rank) => {
                                const entry = podium.find((p) => p.rank === rank);
                                const emoji = topEmojiByRank(rank);
                                const isTop = Boolean(entry);

                                const heightClass =
                                    rank === 1
                                        ? "h-28"
                                        : rank === 2
                                          ? "h-24"
                                          : "h-20";

                                const baseBg =
                                    rank === 1
                                        ? "from-amber-400/30 to-amber-200/30"
                                        : rank === 2
                                          ? "from-slate-400/30 to-slate-200/30"
                                          : "from-orange-400/20 to-orange-200/20";

                                return (
                                    <div key={rank} className="flex flex-col items-center">
                                        <div
                                            className={
                                                [
                                                    "relative w-28 sm:w-32 rounded-xl border px-2 py-3",
                                                    "bg-gradient-to-b",
                                                    baseBg,
                                                    isTop
                                                        ? "border-gray-200 shadow dark:border-gray-700"
                                                        : "border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900",
                                                    "transform-gpu",
                                                    isTop
                                                        ? "animate-[popIn_420ms_ease-out_50ms_both]"
                                                        : "opacity-60",
                                                ].join(" ")
                                            }
                                            style={{ minHeight: "7rem" }}
                                        >
                                            <div className={heightClass} />

                                            {/* avatar/icon */}
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                <div
                                                    className={
                                                        [
                                                            "flex h-12 w-12 items-center justify-center rounded-full",
                                                            "border",
                                                            rank === 1
                                                                ? "border-amber-300 bg-amber-100 text-amber-800"
                                                                : rank === 2
                                                                  ? "border-slate-300 bg-slate-700 text-slate-200"
                                                                  : "border-orange-200 bg-orange-700 text-orange-100",
                                                        ].join(" ")
                                                    }
                                                >
                                                    <span className="text-xl">{emoji ?? ""}</span>
                                                </div>
                                            </div>

                                            {isTop ? (
                                                <div className="mt-8 text-center">
<div className="text-sm font-semibold text-slate-100">{
                                                        entry.username}
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-300">#{rank} • {entry.score ?? "N/A"}</div>
                                                </div>
                                            ) : (
                                                <div className="mt-8 text-center">
<div className="text-sm font-semibold text-slate-300">—</div>
                                                    <div className="mt-1 text-xs text-slate-400">Waiting</div>
                                                </div>
                                            )}

                                            {/* current user marker */}
                                            {isTop && isCurrentUser(entry) && (
                                                <div className="absolute -right-2 top-3 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white shadow">
                                                    YOU
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>


                    {/* Responsive table */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-800 shadow-sm">
                        <div className="overflow-hidden">
                            <div className="hidden md:block">
                                <table className="w-full border-collapse">
<thead className="bg-slate-700 dark:bg-slate-700">
                                        <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-200">
                                            <th className="px-5 py-3">Rank</th>
                                            <th className="px-5 py-3">Player</th>
                                            <th className="px-5 py-3 text-right">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {normalized
                                            .slice()
                                            .sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999))
                                            .map((entry) => {
                                                const emoji = topEmojiByRank(entry.rank);
                                                const you = isCurrentUser(entry);
                                                return (
                                                    <tr
                                                        key={`${entry.rank}-${entry.userId ?? entry.username}`}
                                                        className={
                                                            you
                                                                ? "bg-blue-50 dark:bg-blue-900/30"
                                                                : "bg-slate-800 border-slate-700 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 border"
                                                        }
                                                    >
<td className="px-5 py-3 text-slate-300">

<div className="flex items-center gap-2">
                                                                {emoji ? (
                                                                    <span className="text-base">
                                                                        {emoji}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-slate-400">#</span>
                                                                )}
                                                                <span className="font-medium text-slate-300">
                                                                    {entry.rank != null ? `#${entry.rank}` : "—"}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={
                                                                        [
                                                                            "flex h-9 w-9 items-center justify-center rounded-lg border",
                                                                            you
                                                                                ? "border-blue-200 bg-blue-100 text-blue-700"
                                                                                : "border-slate-600 bg-slate-800 text-slate-200",
                                                                        ].join(" ")
                                                                    }
                                                                >
                                                                    <span className="text-sm font-bold">
                                                                        {(entry.username?.[0] ?? "?").toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div>
<div className="text-sm font-medium text-slate-100">
                                                                        {entry.username ?? "Unknown"}
                                                                    </div>
                                                                    {you && (
                                                                        <div className="mt-0.5 text-[11px] font-bold text-blue-700">
                                                                            Current user
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
<td className="px-5 py-3 text-right">
                                                            <div className="text-sm font-semibold text-slate-100">
                                                                {entry.score ?? "N/A"}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile card list */}
                            <div className="md:hidden">
                                <div className="space-y-3 p-4">
                                    {normalized
                                        .slice()
                                        .sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999))
                                        .map((entry) => {
                                            const emoji = topEmojiByRank(entry.rank);
                                            const you = isCurrentUser(entry);

                                            return (
                                                <div
                                                    key={`${entry.rank}-${entry.userId ?? entry.username}`}
                                                    className={
                                                        [
                                                            "rounded-xl border p-4 shadow-sm",
                                                            you
                                                                ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30"
                                                                : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
                                                            "transition-transform duration-200 hover:-translate-y-0.5",
                                                        ].join(" ")
                                                    }
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                {emoji ? (
                                                                    <span className="text-xl">{emoji}</span>
                                                                ) : (
                                                                    <span className="text-slate-400">#{entry.rank ?? "—"}</span>
                                                                )}
                                                                <div className="truncate text-sm font-bold text-white">
                                                                    {entry.username ?? "Unknown"}
                                                                </div>
                                                            </div>
                                                            <div className="mt-1 text-xs text-slate-400">
                                                                Score: {entry.score ?? "N/A"}
                                                            </div>
                                                        </div>

                                                        {you && (
                                                            <div className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow">
                                                                YOU
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default LeaderboardPage;


