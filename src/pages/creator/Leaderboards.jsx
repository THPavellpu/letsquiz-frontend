import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyLeaderboards } from "../../api/quizApi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

function Leaderboards() {
  const navigate = useNavigate();

  const [leaderboards, setLeaderboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchMyLeaderboards() {
      try {
        setLoading(true);
        setError("");

        const response = await getMyLeaderboards();
        const data = response?.data;

        // Support multiple possible backend response shapes.
        const list =
          Array.isArray(data)
            ? data
            : data?.leaderboards
              ? data.leaderboards
              : data?.results
                ? data.results
                : [];

        if (isMounted) setLeaderboards(list);
      } catch (err) {
        if (!isMounted) return;
        setError(JSON.stringify(err?.response?.data || err?.message || err));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchMyLeaderboards();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasLeaderboards = useMemo(() => Array.isArray(leaderboards) && leaderboards.length > 0, [leaderboards]);

  // Helper to get podium emoji
  const getPodiumEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
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

  if (!hasLeaderboards) {
    return (
      <div className="space-y-6 py-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Leaderboards 🏆</h1>
          <p className="mt-2 text-sm text-slate-400">No leaderboard data available.</p>
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
              Leaderboards
              <span className="ml-2" aria-hidden>
                🏆
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              View top performers across all your quizzes.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button variant="ghost" onClick={() => navigate("/profile")}>
              Go Home
            </Button>
          </div>
        </div>
      </header>

      <section className="space-y-6 animate-[fadeIn_260ms_ease-out]">
        {leaderboards.map((leaderboard) => {
          const quizId = leaderboard.quiz_id ?? leaderboard.id ?? leaderboard.quizId;
          const title = leaderboard.quiz_title ?? leaderboard.title ?? leaderboard.name ?? "Unknown Quiz";
          const code = leaderboard.quiz_code ?? leaderboard.code ?? "";
          const participants = leaderboard.participants ?? leaderboard.top_participants ?? leaderboard.entries ?? [];
          const maxTop = 3;

          return (
            <Card
              key={quizId}
              bordered
              className="p-5 transition hover:shadow-md"
              padding="none"
            >
              <div className="space-y-4">
                {/* Quiz Info */}
                <div className="space-y-1 border-b border-slate-700 pb-4">
                  <div className="text-sm text-slate-400">Quiz Title</div>
                  <div className="text-xl font-semibold text-white">{title}</div>
                  {code && (
                    <div className="text-sm text-slate-400">
                      Code: <span className="font-mono">{code}</span>
                    </div>
                  )}
                </div>

                {/* Podium */}
                {participants.length > 0 && (
                  <div className="flex justify-center gap-4 py-4">
                    {/* Second place */}
                    {participants[1] && (
                      <div className="flex flex-col items-center">
                        <div className="text-4xl">{getPodiumEmoji(2)}</div>
                        <div className="mt-2 text-sm font-medium text-white">
                          {participants[1].username ?? participants[1].user ?? "Player 2"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {participants[1].score ?? participants[1].total_score ?? 0} pts
                        </div>
                      </div>
                    )}
                    {/* First place */}
                    {participants[0] && (
                      <div className="flex flex-col items-center">
                        <div className="text-5xl">{getPodiumEmoji(1)}</div>
                        <div className="mt-2 text-sm font-medium text-white">
                          {participants[0].username ?? participants[0].user ?? "Player 1"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {participants[0].score ?? participants[0].total_score ?? 0} pts
                        </div>
                      </div>
                    )}
                    {/* Third place */}
                    {participants[2] && (
                      <div className="flex flex-col items-center">
                        <div className="text-4xl">{getPodiumEmoji(3)}</div>
                        <div className="mt-2 text-sm font-medium text-white">
                          {participants[2].username ?? participants[2].user ?? "Player 3"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {participants[2].score ?? participants[2].total_score ?? 0} pts
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* All participants (if more than 3) */}
                {participants.length > maxTop && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-medium text-slate-300">
                      Other Participants
                    </div>
                    <div className="space-y-1">
                      {participants.slice(maxTop).map((participant, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded bg-slate-800 px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-400">
                              {idx + maxTop + 1}.
                            </span>
                            <span className="text-sm text-white">
                              {participant.username ?? participant.user ?? "Player"}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {participant.score ?? participant.total_score ?? 0} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No participants */}
                {participants.length === 0 && (
                  <div className="py-4 text-center text-sm text-slate-400">
                    No participants yet.
                  </div>
                )}

                {/* View Full Leaderboard Button */}
                <div className="mt-4">
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full"
                    onClick={() => navigate(`/leaderboard/${quizId}`)}
                    disabled={!quizId}
                  >
                    View Full Leaderboard
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

export default Leaderboards;