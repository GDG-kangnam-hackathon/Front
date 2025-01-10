'use client'

import React, { useEffect, useState } from 'react'
import useModal from '@/hooks/useModal'
import { Button } from '@/components/ui/button'
import { Diary } from '../api/diary/model'

const ReadModal = () => {
  const { isOpen, openModal, closeModal } = useModal()
  const [animating, setAnimating] = useState(false)
  const [data, setData] = useState<Diary | null>(null)
  const [loading, setLoading] = useState(true)

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dayName = dayNames[date.getDay()]
    return `${year}. ${month}. ${day} (${dayName})`
  }

  // API로 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/diary')
        if (!response.ok) throw new Error('Failed to fetch data')
        const result = await response.json()
        setData(result[0])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleOpenModal = () => {
    openModal()
  }

  const handleCloseModal = () => {
    setAnimating(true)
    setTimeout(() => {
      closeModal()
      setAnimating(false)
    }, 500)
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        모달 열기
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
            <div
              className={`bg-paper-texture bg-cover brightness-105 rounded-lg shadow-lg w-[37.5rem] h-fit p-6 
    ${animating ? 'animate-slide-down' : 'animate-slide-up'}`}
            >
              <div className="flex justify-between items-center mb-[2.688rem]">
                <hr
                  className="w-[8.5rem] h-[0.5rem] mx-auto bg-gray-300 border-0 rounded"
                  onClick={handleCloseModal}
                ></hr>
              </div>
              {/* 날짜 출력 */}
              <p className="text-[#6F6F6F] text-center font-kopub text-[28px] font-medium leading-normal mb-[2.688rem]">
                {data?.date ? formatDate(data.date) : '날짜 없음'}
              </p>
              <div className="flex justify-center items-center flex-col">
                <img
                  src="./images/sad.svg"
                  alt=""
                  className="w-[112px] h-[96px]"
                />
                <div className="relative mb-[42px]">
                  <img
                    src="./images/union.svg"
                    className="w-[113px] h-[96px]"
                  />
                  <span className=" absolute top-5 left-9 text-center font-nanum text-[30px] not-italic font-normal leading-normal">
                    {data?.emotionScore
                      ? `${data.emotionScore}점`
                      : '점수 없음'}
                  </span>
                </div>
                {/* 내용 출력 */}
                <p className="text-[#050505] text-center font-nanum text-[30px] not-italic font-normal leading-normal px-[68px] mb-[40px]">
                  {data?.content || '내용 없음'}
                </p>
              </div>
              <div className="flex justify-center gap-[29px]">
                <Button className="w-[200px] h-[64px] rounded-[36px] border-[3px] border-[#BFBFBF] bg-white text-custom-pink text-center font-nanum text-[44px] not-italic font-normal leading-[26px]">
                  수정
                </Button>
                <Button className="w-[200px] h-[64px] rounded-[36px] bg-custom-pink text-center font-nanum text-[44px] not-italic font-normal leading-[26px]">
                  확인
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ReadModal
