import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getProfile,
    getProfileStats,
    logoutUser,
} from "../../api/authApi";


import { useAuth } from "../../context/AuthContext";

import { 
    BarChart3,
    ClipboardCheck,
    LayoutDashboard,
    Users,
} from "lucide-react";

import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";

function Profile() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();


    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await getProfile();
                setUser(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        async function loadProfileStats() {
            try {
                const response = await getProfileStats();
                setStats(response.data);
            } catch (error) {
                console.error(error);
                setStats(null);
            }
        }

        fetchProfile();
        loadProfileStats();
    }, []);


    async function handleLogout() {
        try {
            await logoutUser();
        } catch (error) {
            console.error(error);
        }

        logout();
        navigate("/login");
    }

    const computedStats = useMemo(() => {
        const totalQuizzes =
            stats?.total_quizzes_created ??
            stats?.totalQuizzesCreated ??
            0;

        const participations =
            stats?.participations ??
            stats?.total_participations ??
            stats?.totalParticipations ??
            0;

        const completedQuizzes =
            stats?.completed_quizzes ??
            stats?.completedQuizzes ??
            0;

        const averageScore =
            stats?.average_score ??
            stats?.averageScore ??
            0;

        return {
            totalQuizzes,
            participations,
            completedQuizzes,
            averageScore,
        };
    }, [stats]);


    const formatNumber = (value) => {
        if (value == null || value === "") return 0;
        const num = Number(value);
        if (Number.isNaN(num)) return 0;
        return Number.isInteger(num) ? String(num) : num.toFixed(1);
    };


    if (!user) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Profile</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <span>Username: <span className="font-medium text-gray-900 dark:text-gray-100">{user.username}</span></span>
                        <span>Email: <span className="font-medium text-gray-900 dark:text-gray-100">{user.email}</span></span>
                        <span>
                            Verified: <span className="font-medium text-gray-900 dark:text-gray-100">{user.is_verified ? "Yes" : "No"}</span>
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="hidden sm:inline-flex h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

            <div>
                <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">Your performance</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Quick stats based on your quiz activity.
                </p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Quizzes"
                        value={formatNumber(computedStats.totalQuizzes)}

                        subtitle="All quizzes created"
                        icon={<LayoutDashboard className="h-5 w-5" />}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
                    />

                    <StatCard
                        title="Participations"
                        value={formatNumber(computedStats.participations)}

                        subtitle="Quizzes you joined"
                        icon={<Users className="h-5 w-5" />}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
                    />

                    <StatCard
                        title="Completed Quizzes"
                        value={formatNumber(computedStats.completedQuizzes)}

                        subtitle="Finished attempts"
                        icon={<ClipboardCheck className="h-5 w-5" />}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
                    />

                    <StatCard
                        title="Average Score"
                        value={formatNumber(computedStats.averageScore)}

                        subtitle="Across completed quizzes"
                        icon={<BarChart3 className="h-5 w-5" />}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
                    />
                </div>
            </div>

            <Card className="p-0" bordered={false} shadow={false}>
                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Tip</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Keep participating to improve your average score.
                    </p>
                </div>
            </Card>
        </div>
    );
}

export default Profile;

