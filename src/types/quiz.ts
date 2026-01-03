export type QuestionType = 'multichoice' | 'short_answer' | 'fill_blank' | 'sort' | 'match' | 'click_order';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  points: number;
}

export interface MultiChoiceQuestion extends BaseQuestion {
  type: 'multichoice';
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation?: string;
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short_answer';
  correctAnswers: string[]; // List of acceptable answers
  caseSensitive?: boolean;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill_blank';
  content: string; // "The capital of [France] is [Paris]"
  blanks: { id: string; answer: string }[];
}

export interface SortQuestion extends BaseQuestion {
  type: 'sort';
  items: { id: string; content: string; order: number; isDistractor?: boolean }[];
}

export interface MatchQuestion extends BaseQuestion {
  type: 'match';
  pairs: { id: string; left: string; right: string }[];
}

export interface ClickOrderQuestion extends BaseQuestion {
  type: 'click_order';
  items: { id: string; content: string; order: number; isDistractor?: boolean }[];
}

export type QuizQuestion = MultiChoiceQuestion | ShortAnswerQuestion | FillBlankQuestion | SortQuestion | MatchQuestion | ClickOrderQuestion;

export interface QuizData {
  questions: QuizQuestion[];
  settings: {
    timeLimit?: number; // minutes
    passingScore: number; // percentage
    shuffleQuestions: boolean;
  };
}
