'use client'

import { useState } from 'react'

const HomePage = () => {
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchResponse = async () => {
    setLoading(true)
    setResponse(null)
    try {
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '오늘 한국 서울의 날씨는?' }),
      })

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`)
      }

      const data = await res.json()
      setResponse(data.message)
    } catch (error) {
      console.error(error)
      setResponse('오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={fetchResponse} disabled={loading}>
        {loading ? '로딩 중...' : '질문하기'}
      </button>
      {response && <p>응답: {response}</p>}
    </div>
  )
}

export default HomePage
