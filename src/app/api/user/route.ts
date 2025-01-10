import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await prisma.user.findUnique({
    where: {
      id: process.env.NEXT_PUBLIC_USER_ID,
    },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  return NextResponse.json(user)
}

export async function PUT(req: Request) {
  const { jobField } = await req.json()

  const updatedUser = await prisma.user.update({
    where: {
      id: process.env.NEXT_PUBLIC_USER_ID as string,
    },
    data: {
      jobField,
    },
  })

  return NextResponse.json(updatedUser) // Return updated user data or a success message
}
