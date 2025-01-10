'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Diary } from '@/app/api/diary/model'
import { Icon } from '@iconify/react/dist/iconify.js'
import EmotionImage from './emotion'

interface ReadModalProps {
  isOpen: boolean
  onClose: () => void
  diary: Diary | null
  onEdit: () => void
}

const ReadModal: React.FC<ReadModalProps> = ({
  isOpen,
  onClose,
  diary,
  onEdit,
}) => {
  const [animating, setAnimating] = useState(false)

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dayName = dayNames[date.getDay()]
    return `${year}. ${month}. ${day} (${dayName})`
  }

  const handleClose = () => {
    setAnimating(true)
    setTimeout(() => {
      onClose()
      setAnimating(false)
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="h-[95dvh] fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div
        className={`bg-paper-texture bg-cover brightness-105 rounded-lg shadow-lg w-[37.5rem] h-fit p-6 
        ${animating ? 'animate-slide-down' : 'animate-slide-up'}`}
      >
        <div className="absolute top-[-50px] left-4">
          <Icon
            icon="mingcute:back-line"
            className="w-[41px] h-[41px] hover:cursor-pointer"
            onClick={handleClose}
          />
        </div>
        <div className="flex justify-between items-center mb-[2.688rem]">
          <hr
            className="w-[8.5rem] h-[0.5rem] mx-auto bg-gray-300 border-0 rounded"
            onClick={handleClose}
          />
        </div>
        {/* 날짜 출력 */}
        <p className="text-[#6F6F6F] text-center font-kopub text-[28px] font-medium leading-normal mb-[2.688rem]">
          {diary?.date ? formatDate(diary.date) : '날짜 없음'}
        </p>
        <div className="flex justify-center items-center flex-col">
          <EmotionImage
            emotion={diary?.emotionType}
            showText={false}
            isSelected={true}
          />
          <div className="relative mb-[42px]">
            <img src="./images/union.svg" className="w-[113px] h-[96px]" />
            <span className="absolute top-5 left-9 text-center font-nanum text-[30px]">
              {diary?.emotionScore ? `${diary.emotionScore}점` : '점수 없음'}
            </span>
          </div>
          {/* 내용 출력 */}
          <p className="text-[#050505] text-center font-nanum text-[30px] px-[68px] mb-[40px]">
            {diary?.content || '내용 없음'}
          </p>
        </div>
        <div className="flex justify-center gap-[29px]">
          <Button
            className="w-[200px] h-[64px] rounded-[36px] border-[3px] border-[#BFBFBF] bg-white text-custom-pink"
            onClick={onEdit}
          >
            수정
          </Button>
          <Button
            className="w-[200px] h-[64px] rounded-[36px] bg-custom-pink"
            onClick={handleClose}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReadModal
