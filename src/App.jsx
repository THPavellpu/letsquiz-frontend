import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Profile from "./pages/auth/Profile";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifySuccess from "./pages/auth/VerifySuccess";
import VerifyFailed from "./pages/auth/VerifyFailed";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateQuiz from "./pages/creator/CreateQuiz";
import AddQuestion from "./pages/creator/AddQuestion";

import JoinQuiz from "./pages/player/JoinQuiz";
import QuizPage from "./pages/player/QuizPage";
import ResultPage from "./pages/player/ResultPage";
import LeaderboardPage from "./pages/player/LeaderboardPage";
import Dashboard from "./pages/creator/Dashboard";
import Leaderboards from "./pages/creator/Leaderboards";
import Analytics from "./pages/creator/Analytics";
import QuizSummary from "./pages/creator/QuizSummary";
import MyPerformance from "./pages/player/MyPerformance";
import AIQuizGenerator from "./pages/creator/AIQuizGenerator";

import PageContainer from "./components/layout/PageContainer";



function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
        }
      />


      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

      <Route path="/verify-success" element={<VerifySuccess />} />
      <Route path="/verify-failed" element={<VerifyFailed />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PageContainer>
              <Profile />
            </PageContainer>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-quiz"
        element={
          <ProtectedRoute>
            <PageContainer>
              <CreateQuiz />
            </PageContainer>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-generate"
        element={
          <ProtectedRoute>
            <PageContainer>
              <AIQuizGenerator />
            </PageContainer>
          </ProtectedRoute>
        }
      />


      <Route
        path="/add-question/:quizId"
        element={
          <ProtectedRoute>
            <PageContainer>
              <AddQuestion />
            </PageContainer>
          </ProtectedRoute>
        }
      />

      <Route
        path="/join-quiz"
        element={
          <ProtectedRoute>
            <PageContainer>
              <JoinQuiz />
            </PageContainer>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz/:attemptId"
        element={
          <ProtectedRoute>
            <PageContainer>
              <QuizPage />
            </PageContainer>
          </ProtectedRoute>
        }
      />

      <Route
        path="/results/:attemptId"
        element={
          <ProtectedRoute>
            <PageContainer>
              <ResultPage />
            </PageContainer>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard/:quizId"
        element={
          <ProtectedRoute>
            <PageContainer>
              <LeaderboardPage />
            </PageContainer>
          </ProtectedRoute>
        }
      />

      {/* Creator Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PageContainer>
              <Dashboard />
            </PageContainer>
          </ProtectedRoute>
        }
      />

      {/* My Performance */}
      <Route
        path="/my-performance"
        element={
          <ProtectedRoute>
            <PageContainer>
              <MyPerformance />
            </PageContainer>
          </ProtectedRoute>
        }
      />

      {/* Creator Leaderboards */}
      <Route
        path="/leaderboards"
        element={
          <ProtectedRoute>
            <PageContainer>
              <Leaderboards />
            </PageContainer>
          </ProtectedRoute>
        }
      />

      {/* Quiz Dashboard (legacy, keep working) */}
      <Route
        path="/dashboard/:quizId"
        element={
          <ProtectedRoute>
            <PageContainer>
              <Dashboard />
            </PageContainer>
          </ProtectedRoute>
        }
      />


      <Route
        path="/analytics/:quizId"
        element={
          <ProtectedRoute>
            <PageContainer>
              <Analytics />
            </PageContainer>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz-summary/:quizId"
        element={
          <ProtectedRoute>
            <PageContainer>
              <QuizSummary />
            </PageContainer>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;



