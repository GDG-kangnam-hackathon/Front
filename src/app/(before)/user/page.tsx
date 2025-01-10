'use client'

import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'

interface FormData {
  jobField: string
}

const User = () => {
  const { register, handleSubmit } = useForm<FormData>()
  const router = useRouter()

  const fetchUser: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobField: data.jobField }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      const result = await response.json()
      console.log(result)
      router.push('/home')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <form
        className="flex flex-col items-center justify-between h-full py-14"
        onSubmit={handleSubmit(fetchUser)}
      >
        <div className="flex flex-col gap-10">
          <h1 className="font-nanum text-[60px] text-center">
            지금 하고 있는 분야는?
          </h1>
          <input
            type="text"
            placeholder="내용을 입력하세요."
            className="h-20 border-2 border-[#E3E3E3] px-20 py-8 font-nanum text-center rounded-[40px] text-[40px]"
            {...register('jobField')}
          />
          <p className="font-kopub text-[24px] font-medium text-[#5D5D5D] text-center">
            Ex) 경영, 행정, 보건, 예술, 공학 등
          </p>
        </div>

        <div className="flex">
          <button
            type="submit"
            className="bg-[#F587A0] font-nanum text-[60px] text-white rounded-[58px] px-16 py-[2px]"
          >
            입력하기
          </button>
        </div>
      </form>
    </div>
  )
}

export default User
