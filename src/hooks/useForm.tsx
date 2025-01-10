import { useState } from 'react'

type FormData = {
  dayFeeling: string
  selectedEmotion: string
  emotionScore: number
  reason: string
}

const useForm = () => {
  const [formData, setFormData] = useState<FormData>({
    dayFeeling: '',
    selectedEmotion: '',
    emotionScore: 0, // 기본값을 0으로 설정
    reason: '',
  })

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    console.log(JSON.stringify(formData, null, 2))
  }

  return { formData, handleChange, handleSubmit }
}

export default useForm
