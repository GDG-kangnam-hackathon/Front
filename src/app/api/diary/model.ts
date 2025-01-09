export interface Diary {
  id: string
  userId: string
  content: string
  emotionType: string
  emotionScore: number
  reason?: string
  date: string
}
