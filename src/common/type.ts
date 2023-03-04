export interface Answer {
  question: number | string
  point: number | string | null
  username: string
  part?: number
  createdAt?: string
  updatedAt?: string
}