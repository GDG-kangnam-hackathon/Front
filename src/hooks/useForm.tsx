import { useState } from 'react'

type FormData = {
  dayFeeling: string
  selectedEmotion: string
  emotionInput: string
  reason: string
}

const useForm = () => {
  const [formData, setFormdata] = useState<FormData>({
    dayFeeling: '',
    selectedEmotion: '',
    emotionInput: '',
    reason: '',
  })

  const handleChange = (field: keyof FormData, value: string) => {
    setFormdata((prev) => ({
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
