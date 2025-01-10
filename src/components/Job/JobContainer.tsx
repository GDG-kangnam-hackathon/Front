'use client'

import { RecommendationJob } from '@prisma/client'
import { useState } from 'react'
import Image from 'next/image'

export const JobContainer = (jobs: RecommendationJob[]) => {
  const [index, setIndex] = useState(0)

  const jobArray = Object.values(jobs)

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % jobArray.length)
  }

  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + jobArray.length) % jobArray.length)
  }

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      <p className="text-4xl font-kopub font-bold my-10">
        &lt;{jobArray[index]?.jobName}&gt;
      </p>
      <div className="relative w-full max-w-3xl flex justify-center items-center">
        <button
          onClick={handlePrev}
          className="absolute left-20  text-3xl z-30 bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center focus:outline-none"
        >
          &#8249;
        </button>
        <div className="relative w-[500px] h-[350px] flex justify-center items-center overflow-hidden">
          {jobArray.map((job, idx) => {
            const offset = idx - index
            const isCurrent = idx === index

            return (
              <div
                key={idx}
                className={`absolute transition-all duration-500 ${
                  isCurrent
                    ? 'z-20 scale-125 opacity-100'
                    : 'z-10 scale-75 opacity-50'
                }`}
                style={{
                  transform: `translateX(${offset * 200}px)`,
                  filter: isCurrent ? 'none' : 'brightness(10%)',
                }}
              >
                <Image
                  src={job.jobImage as string}
                  alt={job.jobName}
                  width={300}
                  height={300}
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            )
          })}
        </div>
        <button
          onClick={handleNext}
          className="absolute right-20 z-30 text-3xl bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center focus:outline-none"
        >
          &#8250;
        </button>
      </div>
      <div className="mt-12">
        <p className="px-[31px] py-3 rounded-[40px] border-[3px] bg-[#fff] border-[#D9D9D9] font-kopub text-2xl text-[#FF8984] font-medium">
          AI 거북이의 추천 이유
        </p>
      </div>
      <div className="w-[500px] mt-12">
        <p className="font-nanum text-[36px] text-center">
          {jobArray[index].jobDescription}
        </p>
      </div>
    </div>
  )
}
