import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const now = new Date()
  const stratMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const diarys = await prisma.diary.findMany({
    where: {
      userId: process.env.NEXT_PUBLIC_USER_ID,
      date: {
        gte: stratMonth,
        lte: endMonth,
      },
    },
  })
  return NextResponse.json(diarys)
}
export async function POST(req: Request) {
  const { date, content, emotionType, emotionScore, reason } = await req.json()

  if (!date || !content || !emotionType || !emotionScore) {
    return NextResponse.json(
      { error: 'Content, emotionType, and emotionScore are required' },
      { status: 400 },
    )
  }
  const userId = process.env.NEXT_PUBLIC_USER_ID

  if (!userId) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const diary = await prisma.diary.create({
    data: {
      date,
      content,
      emotionType,
      emotionScore,
      reason,
      userId: userId,
    },
  })
  return NextResponse.json(diary, { status: 201 })
}
