'use client'

import Calendar from '@/components/Calendar/Calendar'
import Diaries from '@/components/Diary/Diaries'
import { useEffect, useState } from 'react'
import { Diary } from '../../api/diary/model'
import dayjs from 'dayjs'

const Home = () => {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [currentDate, setCurrentDate] = useState(dayjs()) // 현재 날짜 상태 추가

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await fetch(
          `/api/diary?day=${encodeURIComponent(currentDate.format('YYYY-MM'))}`,
          {
            method: 'GET',
          },
        )
        if (!response.ok) {
          throw new Error('Failed to fetch diaries')
        }
        const data = await response.json()
        setDiaries(data)
      } catch (error) {
        console.error('Error fetching diaries:', error)
      }
    }

    fetchDiaries()
  }, [currentDate])

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'))
  }

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'))
  }

  const currentMonthText = currentDate.format('YYYY년 M월')

  return (
    <div className="flex flex-col min-h-screen max-w-[600px] mx-auto pb-20">
      <div className="h-full bg-cover bg-center absolute top-0 left-0 right-0 z-0"></div>
      <div className="relative flex flex-col items-center justify-center text-center w-full min-h-screen pt-6 max-w-[600px] mx-auto">
        <div className="flex gap-9 font-nanum text-[60px] mb-6">
          <button className="text-[#D9D9D9]" onClick={handlePrevMonth}>
            &lt;
          </button>
          <p>{currentMonthText}</p>
          <button className="text-[#D9D9D9]" onClick={handleNextMonth}>
            &gt;
          </button>
        </div>

        <div className="flex flex-col w-full min-h-screen gap-16">
          <Calendar currentDate={currentDate as dayjs.Dayjs} />
          <div className="w-full px-6">
            {diaries.length > 0 ? (
              <Diaries diaries={diaries} />
            ) : (
              <p className="text-[#7F7F7F] font-nanum text-[40px]">
                거북이가 당신의 일기를 기다리고 있어요..
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
