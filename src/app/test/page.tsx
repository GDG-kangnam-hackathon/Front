'use client'

import { useState } from 'react'
import { Diary } from '../api/diary/model'
import Image from 'next/image'

const Home = () => {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [gptResponse, setGptResponse] = useState<any>(null)

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
      const response = await fetch('/api/chatgpt/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setGptResponse(data) // JSON 객체로 저장
      } else {
        const errorData = await response.json()
        console.error('Error fetching GPT recommendation:', errorData)
        setGptResponse(null)
      }
    } catch (error) {
      console.error('Error fetching GPT recommendation:', error)
      setGptResponse(null)
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
          <div>
            {gptResponse.recommendedSectors.map(
              (sector: any, index: number) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <h3>
                    {sector.sectorName} (Fit: {sector.fitPercentage}%)
                  </h3>
                  <ul>
                    {sector.recommendedJobs.map(
                      (job: any, jobIndex: number) => (
                        <li
                          key={jobIndex}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                          }}
                        >
                          <Image
                            src={job.jobImage || '/placeholder.jpg'} // 이미지가 없으면 기본 이미지를 표시
                            alt={job.jobName}
                            width={50}
                            height={50}
                            style={{ marginRight: '10px', borderRadius: '4px' }}
                          />
                          <div>
                            <strong>{job.jobName}</strong>
                            {job.jobDescription && <p>{job.jobDescription}</p>}
                          </div>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ),
            )}
          </div>
        ) : (
          <p>Click the button to get a recommendation.</p>
        )}
      </div>
    </div>
  )
}

export default Home
