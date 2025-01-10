'use client'

import React, { useState } from 'react'
import useModal from '@/hooks/useModal'
import { Button } from '@/components/ui/button'

const ModalTest = () => {
  const { isOpen, openModal, closeModal } = useModal()
  const [animating, setAnimating] = useState(false)

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
              <p className="text-[#6F6F6F] text-center font-kopub text-[28px] font-medium leading-normal mb-[2.688rem]">
                2025. 01.08 (수)
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
                    10점
                  </span>
                </div>
                <p className="text-[#050505] text-center font-nanum text-[30px] not-italic font-normal leading-normal px-[68px] mb-[40px]">
                  어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구
                  어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구
                  어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구
                  어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구
                  어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구
                  어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구
                  어쩌구저쩌구
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

export default ModalTest
