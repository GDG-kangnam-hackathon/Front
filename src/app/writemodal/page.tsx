'use client'

import React, { useState } from 'react'
import useModal from '@/hooks/useModal'
import { Textarea } from '@/components/ui/textarea'
import EmotionImage from '@/components/ui/emotion'
import { Button } from '@/components/ui/button'
import useForm from '@/hooks/useForm'
import Slider from '@/components/ui/slider'

const WriteModal = () => {
  const { isOpen, openModal, closeModal } = useModal()
  const { formData, handleChange } = useForm()
  const [animating, setAnimating] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState<string>('')

  const handleOpenModal = () => {
    setSelectedEmotion('Joy')
    handleChange('selectedEmotion', 'Joy')
    openModal()
  }

  const handleCloseModal = () => {
    setAnimating(true)
    setTimeout(() => {
      closeModal()
      setAnimating(false)
    }, 500)
  }

  const handleFormSubmit = async () => {
    try {
      const currentDate = new Date().toISOString() // 현재 날짜를 ISO 8601 형식으로 변환
      const response = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: currentDate,
          content: formData.dayFeeling, // dayFeeling을 content로 매핑
          emotionType: formData.selectedEmotion, // selectedEmotion을 emotionType으로 매핑
          emotionScore: formData.emotionScore,
          reason: formData.reason,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save diary')
      }

      const data = await response.json()
      console.log('Diary saved successfully:', data)
      handleCloseModal()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion)
    handleChange('selectedEmotion', emotion)
  }

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
              className={`bg-paper-texture bg-cover brightness-105 rounded-lg shadow-lg w-[37.5rem] h-[70.75rem] p-6 
    ${animating ? 'animate-slide-down' : 'animate-slide-up'}`}
            >
              <div className="flex justify-between items-center mb-[2.688rem]">
                <hr
                  className="w-[8.5rem] h-[0.5rem] mx-auto bg-gray-300 border-0 rounded"
                  onClick={handleCloseModal}
                ></hr>
              </div>
              <p className="text-[#6F6F6F] text-center font-kopub text-[28px] font-medium leading-normal mb-[2.688rem]">
                2025. 01.08 (수)
              </p>
              <p className="text-black text-center font-kopub text-[28px] font-medium leading-normal mb-[1.781rem]">
                오늘 하루는 어땠어?
              </p>
              <div className="flex justify-center mb-[162.5px]">
                <Textarea
                  className="border-0 h-[2rem] text-gray-500 text-center font-nanum text-2xl not-italic font-normal leading-normal resize-none"
                  placeholder="내용을 입력하세요."
                  onChange={(e) => handleChange('dayFeeling', e.target.value)}
                ></Textarea>
              </div>
              <p className="text-black text-center font-kopub text-[28px] font-medium leading-normal mb-[1.781rem]">
                어떤 감정이 들었어?
              </p>
              <div className="flex justify-center mb-[2rem]">
                <div className="flex gap-4 overflow-x-scroll w-full px-4">
                  {(
                    ['기쁨', '슬픔', '행복', '화남', '보통', '흥미'] as const
                  ).map((emotion) => (
                    <EmotionImage
                      key={emotion}
                      emotion={emotion}
                      showText={true}
                      onClick={() => handleEmotionSelect(emotion)}
                      isSelected={selectedEmotion === emotion}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-center mb-[8.5rem]">
                <Slider
                  max={10}
                  onChange={(value: number) =>
                    handleChange('emotionScore', value)
                  }
                />
              </div>
              <p className="text-black text-center font-kopub text-[28px] font-medium leading-normal mb-[1.25rem]">
                왜 그런 감정이 들었을까?
              </p>
              <div className="flex justify-center mb-[3rem]">
                <Textarea
                  className="border-0 w-[10.188rem] h-[2rem] text-gray-500 text-center font-nanum text-2xl not-italic font-normal leading-normal resize-none"
                  placeholder="내용을 입력하세요."
                  onChange={(e) => handleChange('reason', e.target.value)}
                ></Textarea>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="default"
                  className="rounded-[64px] w-[200px] h-[64px] bg-custom-pink text-center font-nanum text-4xl font-normal leading-[26px]"
                  onClick={handleFormSubmit}
                >
                  기록하기
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default WriteModal
