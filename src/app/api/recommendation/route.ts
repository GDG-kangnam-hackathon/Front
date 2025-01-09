import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export interface gptResponse {
  sectors: {
    name: string
    fitPercentage: number
    reasoning: string
    jobs: { name: string; description?: string }[]
  }[]
}

export async function POST(req: Request) {
  const gptResponse: gptResponse = await req.json()

  // 추천 생성
  const recommendation = await prisma.recommendation.create({
    data: {
      userId: process.env.USER_ID as string,
    },
  })
  for (const sector of gptResponse.sectors) {
    const createdSector = await prisma.recommendationSector.create({
      data: {
        recommendationId: recommendation.id,
        sectorName: sector.name,
        fitPercentage: sector.fitPercentage,
        reasoning: sector.reasoning,
      },
    })
    for (const job of sector.jobs) {
      await prisma.recommendationJob.create({
        data: {
          sectorId: createdSector.id,
          jobName: job.name,
          jobDescription: job.description || null,
        },
      })
    }
  }

  return NextResponse.json({ status: 201 })
}
