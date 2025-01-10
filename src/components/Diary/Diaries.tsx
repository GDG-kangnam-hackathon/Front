import { Diary } from '@/app/api/diary/model'
import Image from 'next/image'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import EmotionImage from '../ui/emotion'
import { Emotion } from '../ui/emotion'

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
          <div key={diary.id} className="flex flex-col ">
            <div className="flex gap-5 items-center py-6">
              <Image src={turtleImage} alt="turtle" width={20} height={26} />
              <div
                className={`flex font-kopub text-[20px] font-bold ${isToday ? '#FF8984' : ''}`}
              >
                {formatDate}
              </div>
            </div>
            <div className="flex">
              <span
                className="border-l-2 border-dashed border-[#D9D9D9] ml-2"
                style={{
                  borderImage:
                    'repeating-linear-gradient(to bottom, transparent, transparent 10px, #D9D9D9 10px, #D9D9D9 20px) 1',
                }}
              ></span>

              <div className="flex flex-col gap-3 px-12 py-3 w-full">
                <div className="flex gap-4 items-center justify-center">
                  {/* EmotionImage 컴포넌트 사용 */}
                  <EmotionImage
                    emotion={diary.emotionType as Emotion}
                    showText={false}
                    isSelected={true}
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
          </div>
        )
      })}
    </div>
  )
}

export default Diaries
