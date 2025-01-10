'use client'

import Statistics from '@/components/Statistics/Statistics'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Activity, EmotionDistribution } from '../../api/chatgpt/analyze/model'
import { SpeechBubble } from '@/components/EmotionColor/SpeechBubble'
import { Loading } from '@/components/Loading/Loading'

const Analysis = () => {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [selectedTab, setSelectedTab] = useState('month')
  const [likedActivities, setLikedActivities] = useState<Activity[]>([])
  const [dislikedActivities, setDislikedActivities] = useState<Activity[]>([])
  const [emotionDistribution, setEmotionDistribution] =
    useState<EmotionDistribution | null>(null)
  const [loading, setLoading] = useState(true)

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab)
  }

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'))
  }

  const currentMonthText = currentDate.format('YYYY년 M월')

  const getPeriodInDays = (tab: string) => {
    switch (tab) {
      case 'week':
        return 7
      case 'month':
        return 30
      case 'year':
        return 365
      default:
        return 7
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/chatgpt/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ period: getPeriodInDays(selectedTab) }),
        })
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        console.log(data)

        const sortedGoodActivities = (data.activities.goodActivities || [])
          .sort((a: Activity, b: Activity) => b.score - a.score)
          .slice(0, 3)

        const sortedBadActivities = (data.activities.badActivities || [])
          .sort((a: Activity, b: Activity) => a.score - b.score)
          .slice(0, 3)

        setLikedActivities(sortedGoodActivities)
        setDislikedActivities(sortedBadActivities)
        setEmotionDistribution(data.emotionDistribution)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLikedActivities([])
        setDislikedActivities([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedTab])

  // 로딩 중 스크롤 비활성화
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto' // 컴포넌트 언마운트 시 초기화
    }
  }, [loading])

  return (
    <div className="relative">
      {/* 로딩 화면 */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loading />
        </div>
      )}

      {/* 메인 UI */}
      <div className="flex flex-col gap-5 px-6 pb-28">
        <div className="flex gap-9 font-nanum text-[60px] mb-6 justify-center">
          <button className="text-[#D9D9D9]" onClick={handlePrevMonth}>
            &lt;
          </button>
          <p>{currentMonthText}</p>
          <button className="text-[#D9D9D9]" onClick={handleNextMonth}>
            &gt;
          </button>
        </div>

        <div className="flex flex-col w-full bg-white border-[3px] border-[#D9D9D9] rounded-[30px] px-12 py-6 items-center gap-6">
          <div className="flex w-[193px] border-[3px] border-[#D9D9D9] rounded-[40px] font-pretendard py-[2px] justify-center self-end">
            <button
              onClick={() => handleTabClick('week')}
              className={`px-4 py-[6px] rounded-[40px] ${
                selectedTab === 'week'
                  ? 'bg-[#F587A0] bg-opacity-50 text-white'
                  : ''
              }`}
            >
              1주
            </button>
            <button
              onClick={() => handleTabClick('month')}
              className={`px-4 py-[6px] rounded-[40px] ${
                selectedTab === 'month'
                  ? 'bg-[#F587A0] bg-opacity-50 text-white'
                  : ''
              }`}
            >
              1달
            </button>
            <button
              onClick={() => handleTabClick('year')}
              className={`px-4 py-[6px] rounded-[40px] ${
                selectedTab === 'year'
                  ? 'bg-[#F587A0] bg-opacity-50 text-white'
                  : ''
              }`}
            >
              1년
            </button>
          </div>

          {emotionDistribution && (
            <Statistics emotionDistribution={emotionDistribution} />
          )}
          <div className="flex self-start">
            <SpeechBubble />
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {/* 좋아하는 활동 */}
          <div className="flex flex-col gap-2 pt-8">
            <div className="flex gap-5">
              <Image
                src="/images/turtle_pink.svg"
                alt="turtle"
                width={18}
                height={26}
              />
              <p className="font-kopub text-[20px] font-medium">
                내가 <span className="text-[#FF8984]">좋아</span>했던 활동
              </p>
            </div>
            <div className="h-full rounded-[90px] rounded-l border-t-[3px] border-b-[3px] border-r-[3px] border-[#D9D9D9] p-3">
              <div className="flex gap-3 h-full justify-between px-10">
                {likedActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-3 justify-center"
                  >
                    <div className="relative w-20 h-20">
                      <Image
                        src={activity.image || '/images/placeholder.svg'}
                        alt={activity.name}
                        width={100}
                        height={100}
                        className="rounded-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black opacity-30 rounded-full"></div>
                      <p className="absolute top-1 left-5 text-white font-nanum text-[40px] z-10">
                        {activity.score}점
                      </p>
                    </div>
                    <p className="font-nanum text-[30px] overflow-hidden text-ellipsis line-clamp-">
                      {activity.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 싫어하는 활동 */}
          <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-5">
              <Image
                src="/images/turtle_blue.svg"
                alt="turtle"
                width={18}
                height={26}
              />
              <p className="font-kopub text-[20px] font-medium">
                내가 <span className="text-[#5A8DE6]">싫어</span>했던 활동
              </p>
            </div>
            <div className="w-full h-full rounded-[90px] rounded-r border-t-[3px] border-b-[3px] border-l-[3px] border-[#D9D9D9] p-3">
              <div className="flex gap-3 h-full justify-between px-10 py-3">
                {dislikedActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center h-full justify-center gap-3"
                  >
                    <div className="relative w-20 h-20">
                      <Image
                        src={activity.image || '/images/placeholder.svg'}
                        alt={activity.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover opacity-30"
                      />
                      <div className="absolute inset-0 bg-black opacity-30 rounded-full"></div>
                      <p className="absolute top-1 left-5 text-white font-nanum text-[40px] z-10">
                        {activity.score}점
                      </p>
                    </div>
                    <p className="font-nanum text-[30px] overflow-hidden text-ellipsis line-clamp-1">
                      {activity.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analysis
