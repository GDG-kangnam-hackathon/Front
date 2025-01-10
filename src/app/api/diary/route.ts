import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const day = url.searchParams.get('day')

  console.log(day)

  const targetDate = new Date(day as string)

  console.log('target: ', targetDate)

  const startOfDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    1,
    0,
    0,
    0,
  )

  const endOfDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth() + 1,
    0,
    23,
    59,
    59,
  )

  const diaries = await prisma.diary.findMany({
    where: {
      userId: process.env.NEXT_PUBLIC_USER_ID,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })
  return NextResponse.json(diaries)
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
