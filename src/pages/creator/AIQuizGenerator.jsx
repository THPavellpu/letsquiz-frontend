import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateAiQuiz } from "../../api/quizApi";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

function AIQuizGenerator() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");


  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleGenerate() {
    setError("");
    setMessage("");

    const sanitizedCount = Math.max(1, Math.min(50, Number(numberOfQuestions) || 1));

    if (!topic.trim()) {
      setError("Topic is required.");
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        topic: topic.trim(),
        number_of_questions: sanitizedCount,
        difficulty,
      };

      const response = await generateAiQuiz(payload);
      const data = response?.data;

      const questions = data?.questions ?? data?.generated_questions ?? data?.results ?? data ?? [];
      const normalizedQuestions = Array.isArray(questions) ? questions : [];

      navigate("/create-quiz", {
        state: {
          mode: "ai",
          generatedQuestions: normalizedQuestions,
        },
      });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (detail === "Failed to generate quiz.") setError("Failed to generate quiz.");
      else setError(JSON.stringify(err?.response?.data || err?.message || err));
    } finally {
      setIsGenerating(false);
    }
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Quiz Generator</h1>
        <p className="mt-1 text-sm text-gray-600">Generate questions automatically using Gemini AI.</p>
      </div>

      <Card className="bg-white dark:bg-slate-800" shadow={true} padding="lg">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              ✨ Generate with AI
            </div>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Fill topic, pick difficulty and generate.</div>
          </div>
          <Badge variant="success">AI</Badge>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Probability and Statistics BTech"
            className="md:col-span-1"
          />

          <Input
            label="Number of Questions"
            type="number"
            min={1}
            max={50}
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
          />

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Difficulty</div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={isGenerating}
            isLoading={isGenerating}
            onClick={handleGenerate}
            className="w-full sm:w-auto"
          >
            ✨ Generate Questions
          </Button>

          <div className="min-h-[32px] text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
            {isGenerating ? (
              <>
                <LoadingSpinner size={18} />
                <span>Generating questions... Please wait.</span>
              </>
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">
            {message}
          </div>
        ) : null}
      </Card>
    </div>
  );
}

export default AIQuizGenerator;

