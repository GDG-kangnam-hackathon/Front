import React from 'react'

type Emotion = 'Input' | 'Sad' | 'Happy' | 'Angry' | 'Normal' | 'Interest'

interface EmotionImageProps {
  emotion: Emotion
}

const EmotionImage: React.FC<EmotionImageProps> = ({ emotion }) => {
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
    <div className="flex flex-col items-center">
      <img
        src={emotionImages[emotion]}
        alt={emotion}
        className="w-[5rem] h-[5rem] object-contain"
      />
      <p className="mt-2 text-lg font-semibold">{emotionTexts[emotion]}</p>
    </div>
  )
}

export default EmotionImage
