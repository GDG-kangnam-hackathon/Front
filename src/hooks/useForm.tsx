import { useState } from 'react'

type FormData = {
  date: Date | null
  dayFeeling: string
  selectedEmotion: string
  emotionScore: number
  reason: string
}

const useForm = (initialValues?: Partial<FormData>) => {
  const [formData, setFormData] = useState<FormData>({
    date: null,
    dayFeeling: '',
    selectedEmotion: '',
    emotionScore: 0,
    reason: '',
    ...initialValues, // 초기값을 병합
  })

  const handleChange = (
    field: keyof FormData,
    value: string | number | Date | null,
  ) => {
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
