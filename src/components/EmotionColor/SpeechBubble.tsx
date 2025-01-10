import { Fragment, useState } from 'react'
import Image from 'next/image'
import { debounce } from 'es-toolkit'

export const SpeechBubble = () => {
  const bubbleImage = [
    '/images/speech-bubble1.svg',
    '/images/speech-bubble2.svg',
    '/images/speech-bubble3.svg',
    '/images/speech-bubble4.svg',
    '/images/speech-bubble5.svg',
  ]
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null) // 마우스가 올라간 원의 인덱스를 추적

  return (
    <div className="flex gap-3 relative">
      {/* 원과 말풍선 영역 */}
      {bubbleImage.map((_, index) => (
        <div key={index} className="group">
          <div
            className="relative"

            // onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* 원 */}
            <div
              className="flex items-center justify-center"
              style={{
                width: '20px', // 원 크기 조정
                height: '20px',
                borderRadius: '50%',
                backgroundColor: getColorForEmotion(index),
                border: `2px solid ${getBorderColorForEmotion(index)}`,
              }}
              // 원에 마우스를 올렸을 때 처리
            ></div>
          </div>
          {/* 말풍선 이미지 (고정된 위치에 출력되며, 마우스가 올려진 원에 맞는 이미지 표시) */}

          <div className="absolute top-[-180px] left-[55%] transform -translate-x-[50%] hidden group-hover:block">
            <Image
              src={bubbleImage[index]}
              alt={`Bubble ${index + 1}`}
              width={200} // 말풍선 이미지의 너비
              height={200} // 말풍선 이미지의 높이
              style={{ maxWidth: 'none', width: '200px', height: '240px' }} // 이미지 크기 강제로 설정
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// 감정에 맞는 색상을 반환하는 함수
const getColorForEmotion = (index: number) => {
  const colors = ['#FAD2D0', '#B4DDFF', '#FF7E77', '#FBB22E', '#08A075']
  return colors[index]
}

// 감정에 맞는 border 색상을 반환하는 함수
const getBorderColorForEmotion = (index: number) => {
  const borders = ['#FFBEBA', '#86C8FF', '#E7716B', '#FFA400', '#067958']
  return borders[index]
}
