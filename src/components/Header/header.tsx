import { useRouter } from 'next/router'
import { Icon } from '@iconify/react' // Import the Iconify component

const WriteModal = ({
  initialDate,
  onClose,
  onDiaryUpdate,
}: WriteModalProps) => {
  const { formData, handleChange } = useForm({
    date: initialDate ? new Date(initialDate) : null,
  })
  const [animating, setAnimating] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState<string>('기쁨')
  const router = useRouter() // Initialize router

  const handleCloseModal = () => {
    setAnimating(true)
    setTimeout(() => {
      onClose()
      setAnimating(false)
    }, 500)
  }

  const handleFormSubmit = async () => {
    try {
      const response = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          content: formData.dayFeeling,
          emotionType: formData.selectedEmotion,
          emotionScore: formData.emotionScore,
          reason: formData.reason,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save diary')
      }

      const newDiary = await response.json()
      onDiaryUpdate({ date: newDiary.date, emotionType: newDiary.emotionType })
      handleCloseModal()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion)
    handleChange('selectedEmotion', emotion)
  }

  return (
    <div>
      <div className="fixed h-[100dvh] inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
        <div
          className={`bg-paper-texture bg-cover brightness-105 rounded-lg shadow-lg w-[37.5rem] h-[70.75rem] p-6 
    ${animating ? 'animate-slide-down' : 'animate-slide-up'}`}
        >
          {/* 좌측 상단 아이콘 */}
          <div className="absolute top-4 left-4">
            <Icon
              icon="mingcute:back-line"
              className="w-[41px] h-[41px] hover:cursor-pointer"
              onClick={() => router.back()} // Navigate back on click
            />
          </div>

          {/* 기존 내용 */}
          <div className="flex justify-between items-center mb-[2.688rem]">
            <hr
              className="w-[8.5rem] h-[0.5rem] mx-auto bg-gray-300 border-0 rounded"
              onClick={handleCloseModal}
            ></hr>
          </div>
          <p className="text-[#6F6F6F] text-center font-kopub text-[28px] font-medium leading-normal mb-[2.688rem]">
            {formData.date
              ? formData.date.toLocaleDateString()
              : '날짜를 선택하세요'}
          </p>
          {/* 모달 내용 계속... */}
        </div>
      </div>
    </div>
  )
}

export default WriteModal
