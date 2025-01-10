import React from 'react'

type Emotion = 'Input' | 'Sad' | 'Happy' | 'Angry' | 'Normal' | 'Interest'

interface EmotionImageProps {
  emotion: Emotion // 감정 선택된 값
  showText?: boolean // 텍스트 표시 여부
  onClick?: () => void // 클릭 이벤트 추가
}

const EmotionImage: React.FC<EmotionImageProps> = ({
  emotion,
  showText = true,
  onClick,
}) => {
  const emotionImages: Record<Emotion, string> = {
    Input: '/images/Input.svg',
    Sad: '/images/sad.svg',
    Happy: '/images/happy.svg',
    Angry: '/images/angry.svg',
    Normal: '/images/normal.svg',
    Interest: '/images/interest.svg',
  }

  const emotionTexts: Record<Emotion, string> = {
    Input: '직접 입력',
    Sad: '슬픔',
    Happy: '행복',
    Angry: '화남',
    Normal: '보통',
    Interest: '흥미',
  }

  return (
    <div className="flex flex-col items-center" onClick={onClick}>
      <img
        src={emotionImages[emotion]}
        alt={emotion}
        className="w-[5rem] h-[5rem] object-contain"
      />
      {showText && (
        <p className="mt-2 text-lg font-semibold">{emotionTexts[emotion]}</p>
      )}
    </div>
  )
}

export default EmotionImage
