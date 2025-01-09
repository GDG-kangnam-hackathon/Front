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
