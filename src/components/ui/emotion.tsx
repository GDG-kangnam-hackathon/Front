import React from 'react'

type Emotion = 'Joy' | 'Sad' | 'Happy' | 'Angry' | 'Normal' | 'Interest'

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
    Joy: '/images/joy.svg',
    Sad: '/images/sad.svg',
    Happy: '/images/happy.svg',
    Angry: '/images/angry.svg',
    Normal: '/images/normal.svg',
    Interest: '/images/interest.svg',
  }

  const emotionTexts: Record<Emotion, string> = {
    Joy: '기쁨',
    Sad: '슬픔',
    Happy: '행복',
    Angry: '화남',
    Normal: '보통',
    Interest: '흥미',
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
