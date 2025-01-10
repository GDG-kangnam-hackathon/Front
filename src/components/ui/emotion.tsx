import React from 'react'

type Emotion = '기쁨' | '슬픔' | '행복' | '화남' | '보통' | '흥미'

interface EmotionImageProps {
  emotion: Emotion
  showText?: boolean
  onClick?: (emotion: Emotion) => void
  isSelected?: boolean
}

const EmotionImage: React.FC<EmotionImageProps> = ({
  emotion,
  showText = true,
  onClick,
  isSelected = false,
}) => {
  const emotionImages: Record<Emotion, string> = {
    기쁨: '/images/joy.svg',
    슬픔: '/images/sad.svg',
    행복: '/images/happy.svg',
    화남: '/images/angry.svg',
    보통: '/images/normal.svg',
    흥미: '/images/interest.svg',
  }

  const emotionTexts: Record<Emotion, string> = {
    기쁨: '기쁨',
    슬픔: '슬픔',
    행복: '행복',
    화남: '화남',
    보통: '보통',
    흥미: '흥미',
  }

  const handleClick = () => {
    if (onClick) {
      onClick(emotion)
    }
  }

  return (
    <div className="flex flex-col items-center" onClick={handleClick}>
      <img
        src={emotionImages[emotion]}
        alt={emotion}
        className={`w-[5rem] h-[5rem] object-contain ${isSelected ? 'opacity-100' : 'opacity-50'}`}
      />
      {showText && (
        <p className="font-kopub mt-2 text-lg font-semibold">
          {emotionTexts[emotion]}
        </p>
      )}
    </div>
  )
}

export default EmotionImage
