export interface Answer {
  question: number
  point: number | string | null
  username: string
  part?: number
  createdAt?: string
  updatedAt?: string
}

export interface ByQuestionMapValue {
  question: number;
  answers: number[];
  part: number;
  avg?: number; // last 3 answers
}