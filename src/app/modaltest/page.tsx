'use client'

import React from 'react'
import useModal from '@/hooks/useModal'

const ModalTest = () => {
  const { isOpen, openModal, closeModal } = useModal()

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
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            {/* 모달 컨텐츠 */}
            <div className="bg-white rounded-lg shadow-lg w-96 mx-4 md:mx-0 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  모달 제목입니다~
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                모달에 들어갈 내용입니다~모달에 들어갈 내용입니다~모달에 들어갈
                내용입니다~모달에 들어갈 내용입니다~모달에 들어갈
                내용입니다~모달에 들어갈 내용입니다~모달에 들어갈
                내용입니다~모달에 들어갈 내용입니다~모달에 들어갈
                내용입니다~모달에 들어갈 내용입니다~모달에 들어갈
                내용입니다~모달에 들어갈 내용입니다~ 모달에 들어갈
                내용입니다~모달에 들어갈 내용입니다~모달에 들어갈
                내용입니다~모달에 들어갈 내용입니다~모달에 들어갈
                내용입니다~모달에 들어갈 내용입니다~모달에 들어갈
                내용입니다~모달에 들어갈 내용입니다~모달에 들어갈 내용입니다~
              </p>
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ModalTest
