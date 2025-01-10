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
      let jobImage = null
      try {
        const imageResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search-image`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword: job.name }),
          },
        )
        const imageData = await imageResponse.json()
        if (imageResponse.ok && imageData.url) {
          jobImage = imageData.url // API에서 반환된 이미지 URL
        }
      } catch (error) {
        console.error(`Failed to fetch image for job: ${job.name}`, error)
      }
      console.log(jobImage)
      await prisma.recommendationJob.create({
        data: {
          sectorId: createdSector.id,
          jobName: job.name,
          jobDescription: job.description || null,
          jobImage: jobImage,
        },
      })
    }
  }

  return NextResponse.json({ status: 201 })
}

export async function GET() {
  const recommendations = await prisma.recommendation.findFirst({
    where: {
      userId: process.env.USER_ID,
    },
    include: {
      recommendedSectors: {
        include: {
          recommendedJobs: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
  return NextResponse.json(recommendations)
}

export async function DELETE(req: Request) {
  const { name } = await req.json()

  const recommendations = await prisma.recommendation.findFirst({
    where: {
      userId: process.env.USER_ID,
    },
    include: {
      recommendedSectors: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const sector = recommendations?.recommendedSectors.find(
    (sector) => sector.sectorName === name,
  )

  if (sector) {
    await prisma.recommendationSector.delete({
      where: {
        id: sector.id,
      },
    })
    return NextResponse.json({ status: 200 })
  }
  return NextResponse.json({ error: 'Sector not found' }, { status: 202 })
}
