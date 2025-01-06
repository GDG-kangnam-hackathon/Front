import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET: 모든 유저와 관련된 Item 반환
export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      items: true, // 관련된 Item도 포함
    },
  })
  return NextResponse.json(users)
}

// POST: 새로운 유저 생성 + 기본 Item 추가
export async function POST(req: Request) {
  const { name, email } = await req.json()

  let user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    user = await prisma.user.create({
      data: {
        name,
        email,
        items: {
          create: [
            {
              title: 'Welcome Item',
              content: 'This is a default item for new users.',
            },
          ],
        },
      },
      include: {
        items: true,
      },
    })
  }

  return NextResponse.json(user)
}

export async function PUT(req: Request) {
  const { id, name, email } = await req.json()

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
    },
  })

  return NextResponse.json(updatedUser)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()

  try {
    const deletedItem = await prisma.user.delete({
      where: { id: id },
    })

    return NextResponse.json(deletedItem, { status: 200 })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 },
    )
  }
}
