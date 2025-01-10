'use client'

import { CourseHeader } from '@/components/Header/header'
import { useEffect, useState } from 'react'
import CourseChart from '@/components/Chart/CourseChart'
import { ChevronRight } from 'lucide-react'
import { RecommendationSector } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

const CoursePage = () => {
  const [during, setDuring] = useState(31)
  const [data, setData] = useState<RecommendationSector[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chatgpt/recommend`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      const res = await response.json()
      setData(res.recommendedSectors || [])
    }
    fetchData()
  }, [during])

  if (data.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col items-center w-full">
      <CourseHeader during={during} setDuring={setDuring} />
      <div className="flex flex-col items-center bg-white justify-center w-[560px] h-[117px] rounded-[20px] border-[3px] border-solid border-[#D9D9D9]">
        <p className="font-kopub font-[500] text-2xl h-[40px]">
          <span className="text-[#FF8984]">
            {during === 7 ? '이번 주' : during === 31 ? '이번 달' : '올 해'}
          </span>{' '}
          분석 결과
        </p>
        <p className="font-kopub font-[500] text-2xl h-[40px]">
          <span className="text-[#FF8984]">{data && data[0].sectorName}</span>{' '}
          에 가장 높은 흥미를 가지고 있어!
        </p>
      </div>
      <div className="w-[300px] h-[300px] pt-[27px]">
        <CourseChart data={data} />
      </div>
      <div className="flex justify-end items-center w-full mb-5">
        <span className="flex items-center justify-center rounded-[36px] px-4 py-1 bg-[#E3E3E3] font-pretendard mr-5">
          제외 분야 설정
          <ChevronRight size={20} />
        </span>
      </div>
      <span
        className="border-t-2 border-dashed border-[#D9D9D9] mt-2 block mx-auto"
        style={{
          width: 'calc(100% - 40px)',
          borderWidth: '3px',
          borderImage:
            'repeating-linear-gradient(to right, transparent, transparent 15px, #D9D9D9 15px, #D9D9D9 30px) 1', // 점선 길이 증가
        }}
      />

      <div className="flex flex-col w-full px-4 mt-4">
        {data.map((sector, index) => (
          <Link
            href={`/course/${sector.id}`}
            key={sector.id}
            className="flex flex-col items-center w-full py-4"
          >
            {/* 순위 표시 */}
            {index < 3 ? (
              <Image
                src={`/images/king${index + 1}.svg`}
                alt="순위 이미지"
                width={100}
                height={100}
              />
            ) : (
              <div className="flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full">
                <span className="font-bold text-gray-800 text-2xl">
                  {index + 1}
                </span>
              </div>
            )}
            {/* 계통과 백분율 */}
            <div className="text-center text-[40px] font-nanum mt-[10px]">
              <p className="text-gray-800">
                <span className="text-[#FF8984]">{sector.sectorName}</span> 분야
                / {sector.fitPercentage} %
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CoursePage
