'use client'

import { useState } from 'react'
import { Diary } from '../api/diary/model'

const Home = () => {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [gptResponse, setGptResponse] = useState<string>('')

  // 다이어리 조회
  const fetchDiaries = async () => {
    try {
      const response = await fetch('/api/diary', { method: 'GET' })
      const data = await response.json()
      setDiaries(data)
    } catch (error) {
      console.error('Error fetching diaries:', error)
    }
  }

  // GPT 호출
  const fetchGPTRecommendation = async () => {
    try {
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setGptResponse(data)
      } else {
        const errorData = await response.json()
        console.error('Error fetching GPT recommendation:', errorData)
        setGptResponse('Error fetching GPT recommendation.')
      }
    } catch (error) {
      console.error('Error fetching GPT recommendation:', error)
      setGptResponse('Error fetching GPT recommendation.')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Diary API Test</h1>
      <button onClick={fetchDiaries}>Fetch Diaries</button>
      <button onClick={fetchGPTRecommendation}>Get GPT Recommendation</button>
      <ul>
        {diaries.length > 0 ? (
          diaries.map((diary: Diary) => (
            <li key={diary.id}>
              <strong>{new Date(diary.date).toLocaleString()}</strong> -{' '}
              {diary.content} ({diary.emotionType}, Score: {diary.emotionScore})
              {diary.reason && <em> - Reason: {diary.reason}</em>}
            </li>
          ))
        ) : (
          <p>No diaries found.</p>
        )}
      </ul>
      <div style={{ marginTop: '20px' }}>
        <h2>GPT Recommendation</h2>
        {gptResponse ? (
          <p>{gptResponse}</p>
        ) : (
          <p>Click the button to get a recommendation.</p>
        )}
      </div>
    </div>
  )
}

export default Home
