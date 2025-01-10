'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const HomePage = () => {
  const router = useRouter()
  const [isFading, setIsFading] = useState(false)

  const handleClick = () => {
    // 페이드 아웃 효과 시작
    setIsFading(true)

    // 애니메이션이 완료된 후 페이지 전환
    setTimeout(() => {
      router.push('/user')
    }, 1000)
  }

  return (
    <div
      className={`max-w-[600px] m-auto min-h-[100dvh] flex flex-col justify-between transition-opacity duration-1000 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`} // 4초 동안 천천히 사라짐
    >
      <div
        className="w-full h-screen flex justify-center items-end"
        style={{
          backgroundImage: 'url(/images/landing.svg)',
        }}
      >
        <button
          type="button"
          onClick={handleClick} // 클릭 시 페이드 아웃과 페이지 전환
          className="bg-[#F587A0] flex font-nanum text-[60px] text-white rounded-[58px] px-16 py-[2px] mb-8"
        >
          입력하기
        </button>
      </div>
    </div>
  )
}

export default HomePage
