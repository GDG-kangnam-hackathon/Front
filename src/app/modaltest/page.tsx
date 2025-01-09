'use client'

import React, { useState } from 'react'
import useModal from '@/hooks/useModal'
import { Textarea } from '@/components/ui/textarea'
import EmotionImage from '@/components/ui/emotion'
import { Button } from '@/components/ui/button'

const ModalTest = () => {
  const { isOpen, openModal, closeModal } = useModal()
  const [animating, setAnimating] = useState(false)

  const handleCloseModal = () => {
    setAnimating(true)
    setTimeout(() => {
      closeModal()
      setAnimating(false)
    }, 500)
  }

  const handleSubmit = () => {
    console.log('제출 완료')
    handleCloseModal()
  }

  return (
    <div>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        모달 열기
      </button>

      {isOpen && (
        <>
          {/* 모달 배경 */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
            {/* 모달 컨텐츠 */}
            <div
              className={`bg-paper-texture bg-cover rounded-lg shadow-lg w-[37.5rem] h-[70.75rem] p-6 
                ${animating ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}
            >
              <div className="flex justify-between items-center mb-[2.688rem]">
                <hr
                  className="w-[8.5rem] h-[0.5rem] mx-auto  bg-gray-300 border-0 rounded"
                  onClick={handleCloseModal}
                ></hr>
              </div>
              <p className="text-[#6F6F6F] text-center font-[KoPubWorldBatang] text-[28px] font-medium leading-normal mb-[2.688rem]">
                2025. 01.08 (수)
              </p>
              <p className="text-black text-center font-[KoPubWorldBatang] text-[28px] font-medium leading-normal mb-[1.781rem]">
                오늘 하루는 어땠어?
              </p>
              <div className="flex justify-center mb-[10.156rem]">
                <Textarea
                  className="w-[10.188rem] h-[2rem]"
                  placeholder="내용을 입력하세요."
                ></Textarea>
              </div>
              <p className="text-black text-center font-[KoPubWorldBatang] text-[28px] font-medium leading-normal mb-[1.781rem]">
                어떤 감정이 들었어?
              </p>
              <div className="flex justify-center mb-[2rem]">
                <div className="flex gap-4 overflow-x-scroll w-full px-4">
                  {(
                    [
                      'Input',
                      'Sad',
                      'Happy',
                      'Angry',
                      'Normal',
                      'Interest',
                    ] as const
                  ).map((emotion) => (
                    <EmotionImage
                      key={emotion}
                      emotion={emotion}
                      showText={true}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-center mb-[8.5rem]">
                <Textarea
                  className="w-[10.188rem] h-[2rem]"
                  placeholder="내용을 입력하세요."
                ></Textarea>
              </div>
              <p className="text-black text-center font-[KoPubWorldBatang] text-[28px] font-medium leading-normal mb-[1.25rem]">
                왜 그런 감정이 들었을까?
              </p>
              <div className="flex justify-center mb-[3rem]">
                <Textarea
                  className="w-[10.188rem] h-[2rem]"
                  placeholder="내용을 입력하세요."
                ></Textarea>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="default"
                  className="bg-custom-pink"
                  onClick={handleSubmit}
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

export default ModalTest
