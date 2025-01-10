import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()

  if (!id) {
    return NextResponse.json({ error: 'ID not found' }, { status: 404 })
  }

  const diary = await prisma.diary.findUnique({
    where: {
      id: id,
    },
  })
  if (!diary) {
    return NextResponse.json({ error: 'Diary not found' }, { status: 404 })
  }
  return NextResponse.json(diary)
}

export async function PUT(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()
  const { date, content, emotionType, emotionScore, reason } = await req.json()

  if (!id || !date || !content || !emotionType || !emotionScore) {
    return NextResponse.json(
      {
        error: 'ID, date, content, emotionType, and emotionScore are required',
      },
      { status: 400 },
    )
  }

  const userId = process.env.USER_ID

  const diary = await prisma.diary.update({
    where: {
      id: id,
    },
    data: {
      date,
      content,
      emotionType,
      emotionScore,
      reason,
      userId: userId,
    },
  })
  return NextResponse.json(diary)
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()

  if (!id) {
    return NextResponse.json({ error: 'ID not found' }, { status: 404 })
  }

  const diary = await prisma.diary.delete({
    where: {
      id: id,
    },
  })
  return NextResponse.json(diary)
}
