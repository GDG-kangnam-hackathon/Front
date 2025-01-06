import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET: 특정 유저와 관련된 아이템 가져오기
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await prisma.user.findUnique({
    where: { id: params.id }, // Prisma에서 숫자로 변환 필요
    include: { items: true }, // 관련된 Item 포함
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}
