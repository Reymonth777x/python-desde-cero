export type QuizAnswerKey = {
  answer: number;
};

export function gradeQuiz(questions: QuizAnswerKey[], answers: number[]) {
  const correct = questions.reduce(
    (total, question, index) => total + Number(answers[index] === question.answer),
    0,
  );
  const score = questions.length
    ? Math.round((correct / questions.length) * 100)
    : 0;

  return {
    correct,
    total: questions.length,
    score,
    passed: questions.length > 0 && score >= 75,
  };
}
