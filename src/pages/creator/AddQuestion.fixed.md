This file documents the intended fix for AddQuestion.jsx:

1) Keep `const [questionOrder, setQuestionOrder] = useState(1);`
2) On mount/quizId change:
   - call `getQuizSummary(quizId)`
   - read `total_questions` (or fallback to `questions_added`)
   - set `questionOrder = total + 1`
3) Add separate submit handlers:
   - handleSaveQuestion(): validate -> POST createQuestionWithOptions -> clear? (if required) -> setQuestionOrder(prev+1)
   - handleSaveAndAddAnother(): validate -> POST -> clear question fields only -> setQuestionOrder(prev+1)
4) Finish button must be `type="button"` and only navigate(`/quiz-summary/${quizId}`)
5) Show order as `Question #${questionOrder}`; no input control to edit order.

