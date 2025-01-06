import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// POST: 새로운 아이템 추가
export async function POST(req: Request) {
  const { userId, title, content } = await req.json()

  try {
    const newItem = await prisma.item.create({
      data: {
        title,
        content,
        userId: userId, // Prisma에서 숫자로 변환 필요
      },
    })

    return NextResponse.json(newItem, { status: 201 })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 },
    )
  }
}

// PUT: 아이템 수정
export async function PUT(req: Request) {
  const { id, title, content } = await req.json()

  try {
    const updatedItem = await prisma.item.update({
      where: { id: id },
      data: { title, content },
    })

    return NextResponse.json(updatedItem, { status: 200 })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 },
    )
  }
}

// DELETE: 아이템 삭제
export async function DELETE(req: Request) {
  const { id } = await req.json()

  try {
    const deletedItem = await prisma.item.delete({
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
