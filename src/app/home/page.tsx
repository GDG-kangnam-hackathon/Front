'use client'

import Calendar from '@/components/Calendar/Calendar'
import Diaries from '@/components/Diary/Diaries'
import NavigationBar from '@/components/NavigationBar/NavigationBar'
import { useEffect, useState } from 'react'
import { Diary } from '../api/diary/model'
import dayjs from 'dayjs'
import Analysis from '../analysis/page'

const Main = () => {
  const [navigation, setNavigation] = useState('home')
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [currentDate, setCurrentDate] = useState(dayjs()) // 현재 날짜 상태 추가

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await fetch('/api/diary', { method: 'GET' })
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
  }, []) // 빈 배열을 의존성 배열로 추가하여 컴포넌트 마운트 시 한 번만 실행

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'))
  }

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'))
  }

  // 현재 월 텍스트 포맷 (예: 2025년 1월)
  const currentMonthText = currentDate.format('YYYY년 M월')

  return (
    <div className="relative flex flex-col min-h-screen max-w-[600px] mx-auto pb-20">
      {/* 배경 이미지 및 콘텐츠 */}
      <div
        className="h-full bg-cover bg-center absolute top-0 left-0 right-0 z-0"
        style={{
          backgroundImage: 'url(/images/paper-texture.svg)',
          filter: 'brightness(1.05)', // 배경 이미지 밝기 조절
        }}
      ></div>
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

        {/* Render components based on active navigation */}
        {navigation === 'home' && (
          <div className="flex flex-col gap-16">
            <Calendar currentDate={currentDate} />
            <div className="w-full px-6">
              {diaries.length > 0 ? (
                <Diaries diaries={diaries} />
              ) : (
                <p className="text-[#7F7F7F] font-nanum text-[20px]">
                  거북이가 당신의 일기를 기다리고 있어요..
                </p>
              )}
            </div>
          </div>
        )}

        {/* You can conditionally add more content for other navigation items */}
        {navigation === 'analyze' && <Analysis />}

        {navigation === 'course' && (
          <div>
            {/* Course content */}
            <p>Career course content goes here...</p>
          </div>
        )}
      </div>

      {/* 네비게이션 바 */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] z-10">
        <NavigationBar navigation={navigation} setNavigation={setNavigation} />
      </div>
    </div>
  )
}

export default Main
