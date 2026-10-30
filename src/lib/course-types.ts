export type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type CourseExercise = {
  id: string;
  title: string;
  statement: string;
  starterCode: string;
  solution: string;
  tests: Array<{ input: string[]; expected: string }>;
  hints: string[];
  difficulty: 'facil' | 'medio' | 'dificil';
  xp: number;
  length: number;
};

export type CourseLesson = {
  id: string;
  section: string;
  title: string;
  objectives: string[];
  explanation: string[];
  example: string;
  exampleOutput: string;
  walkthrough: string[];
  commonMistakes: string[];
  exercise: CourseExercise;
  questions: QuizQuestion[];
  assessment?: boolean;
  finalProject?: boolean;
  finalAssessment?: boolean;
  estimatedMinutes: number;
};

export type CourseModule = {
  id: string;
  number: string;
  title: string;
  summary: string;
  lessons: CourseLesson[];
  optional?: boolean;
};

export type ClientSafeQuizQuestion = Omit<QuizQuestion, 'answer' | 'explanation'>;
export type ClientSafeExercise = Omit<CourseExercise, 'solution'>;
export type ClientSafeLesson = Omit<CourseLesson, 'questions' | 'exercise'> & {
  questions: ClientSafeQuizQuestion[];
  exercise: ClientSafeExercise;
};
