import { Diary } from '@/app/api/diary/model'
import Image from 'next/image'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'

const Diaries = ({ diaries }: { diaries: Diary[] }) => {
  const turtle = [
    '/images/turtle_pink.svg',
    '/images/turtle_blue.svg',
    '/images/turtle_red.svg',
  ]

  const today = dayjs().format('YYYY. MM. DD') // 오늘 날짜 형식 (YYYY. MM. DD)

  return (
    <div className="flex flex-col gap-8 px-6">
      {diaries.map((diary, index) => {
        const turtleImage = turtle[index % turtle.length] // 순차적으로 거북이 선택
        const formatDate = dayjs(diary.date)
          .locale('ko')
          .format('YYYY. MM. DD (ddd)')
        const isToday = formatDate.startsWith(today)

        return (
          <div key={diary.id} className="flex flex-col gap-4">
            <div className="flex gap-5 items-center py-6">
              <Image src={turtleImage} alt="turtle" width={20} height={26} />
              <div
                className={`flex font-kopub text-[20px] font-bold ${isToday ? '#FF8984' : ''}`}
              >
                {formatDate}
              </div>
            </div>
            <div className="flex flex-col gap-3 px-12">
              <div className="flex gap-4 items-center justify-center">
                <Image
                  src="/images/normal.svg"
                  alt="interest"
                  width={65}
                  height={56}
                />
                <p className="font-nanum text-[40px]">
                  {diary.emotionType} {diary.emotionScore} 점
                </p>
              </div>
              <p className="font-nanum text-[30px] text-[#838383] overflow-hidden text-ellipsis line-clamp-2">
                {diary.content}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Diaries
