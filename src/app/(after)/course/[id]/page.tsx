import { JobHeader } from '@/components/Header/header'
import { prisma } from '@/lib/prisma'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { JobContainer } from '@/components/Job/JobContainer'

interface JobPageProps {
  params: {
    id: string
  }
}

const JobPage = async ({ params }: JobPageProps) => {
  const sector = await prisma.recommendationSector.findUnique({
    where: { id: params.id },
    include: {
      recommendedJobs: true,
    },
  })

  if (!sector) {
    return <div>해당 직업 데이터를 찾을 수 없습니다.</div>
  }

  return (
    <div className="flex flex-col items-center w-full">
      <JobHeader />
      <h1 className="text-6xl font-nanum text-[#FF8984]">이 직업은 어때?</h1>
      <main className="flex flex-col items-center w-full">
        <JobContainer {...sector.recommendedJobs} />
      </main>
    </div>
  )
}

export default JobPage
