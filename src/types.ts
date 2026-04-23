export type QuestionType = 
  | 'test_single' 
  | 'test_multiple' 
  | 'matching' 
  | 'logical_chain' 
  | 'odd_one_out' 
  | 'case' 
  | 'true_false' 
  | 'classification';

export interface Question {
  id: string;
  type: QuestionType;
  level: 1 | 2 | 3;
  question: string;
  options?: string[]; // For test_single, test_multiple, odd_one_out
  correctAnswer?: string | string[]; // For single, multiple, odd_one_out, true_false
  pairs?: { left: string; right: string }[]; // For matching
  chain?: string[]; // For logical_chain (user needs to order or pick missing)
  missingIndex?: number; // For logical_chain
  categories?: { name: string; items: string[] }[]; // For classification
  hint?: string;
  info?: {
    success: string;
    failure: string;
  };
}

export interface UserStats {
  score: number;
  completedIds: string[];
  currentLevel: 1 | 2 | 3;
}
