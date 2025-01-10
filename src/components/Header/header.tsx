'use client'

import { SetStateAction } from 'react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'

export const CourseHeader = ({
  during,
  setDuring,
}: {
  during: number
  setDuring: React.Dispatch<SetStateAction<number>>
}) => {
  const router = useRouter()

  return (
    <header className="flex flex-row w-full px-[20px] py-[30px] justify-between items-center">
      <Icon
        icon="mingcute:back-line"
        className={`w-[41px] h-[41px] hover:cursor-pointer`}
        onClick={() => router.back()}
      />
      <div
        className="w-fit h-12 flex justify-between items-center font-pretendard p-[4px]"
        style={{
          borderRadius: '40px',
          border: '3px solid rgba(0, 0, 0, 0.10)',
          backgroundColor: '#FFF',
        }}
      >
        <div
          className={`w-14 h-9 flex justify-center items-center ${during === 7 && `bg-[#F587A080] text-white font-semibold`}`}
          style={{ borderRadius: '40px' }}
          onClick={() => setDuring(7)}
        >
          1주
        </div>
        <div
          className={`w-14 h-9 flex justify-center items-center ${during === 31 && `bg-[#F587A080] text-white font-semibold`}`}
          style={{ borderRadius: '40px' }}
          onClick={() => setDuring(31)}
        >
          1달
        </div>
        <div
          className={`w-14 h-9 flex justify-center items-center ${during === 365 && `bg-[#F587A080] text-white font-semibold`}`}
          style={{ borderRadius: '40px' }}
          onClick={() => setDuring(365)}
        >
          1년
        </div>
      </div>
    </header>
  )
}

export const JobHeader = () => {
  const router = useRouter()

  return (
    <header className="flex flex-row w-full px-[20px] py-[30px] justify-between items-center">
      <Icon
        icon="mingcute:back-line"
        className={`w-[41px] h-[41px] hover:cursor-pointer`}
        onClick={() => router.back()}
      />
    </header>
  )
}
