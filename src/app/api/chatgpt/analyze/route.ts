import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { prisma } from '@/lib/prisma'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
})

export const POST = async (req: Request) => {
  // 요청 본문에서 period 가져오기
  const body = await req.json()
  const { period } = body

  // 기간 계산
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - period)

  // 해당 기간의 일기 가져오기
  const diaries = await prisma.diary.findMany({
    where: {
      userId: process.env.NEXT_PUBLIC_USER_ID,
      date: {
        gte: startDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  })

  if (!diaries || diaries.length === 0) {
    return NextResponse.json(
      { error: '해당 기간 동안 다이어리가 없습니다.' },
      { status: 404 },
    )
  }

  // Diary 데이터를 문자열로 변환
  const diaryContent = diaries
    .map(
      (diary) =>
        `날짜: ${new Date(diary.date).toLocaleDateString()}\n` +
        `내용: ${diary.content}\n` +
        `감정 유형: ${diary.emotionType}, 점수: ${diary.emotionScore}\n` +
        (diary.reason ? `이유: ${diary.reason}` : ''),
    )
    .join('\n\n')

  // OpenAI API 호출
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `
사용자의 다이어리 데이터를 분석하여 감정 분포와 주요 활동 점수를 JSON 형식으로 반환하세요. 
활동 점수를 기반으로 활동을 "좋은 활동"과 "안좋은 활동"으로 분류하세요.

1. **분석 대상**:
   - 감정 분포(행복, 슬픔, 분노, 스트레스 등).
   - 주요 활동(활동명과 점수 포함).

2. **분석 기준**:
   - 감정 분포는 백분율로 계산.
   - 활동 점수는 감정 점수를 기반으로 계산:
     - 긍정적 감정(행복, 기쁨 등)은 80~100점.
     - 부정적 감정(분노, 스트레스 등)은 1~50점.
   - 특정 활동이 반복될수록 점수를 증가.
   - 활동 점수가 50점 이상이면 "좋은 활동", 50점 미만이면 "안좋은 활동"으로 분류.

3. **출력 형식**:
   JSON 형식:
   {
     "emotionDistribution": {
       "행복": 40,
       "슬픔": 30,
       "분노": 20,
       "스트레스": 10
     },
     "activities": {
       "goodActivities": [
         {
           "name": "좋은 활동명",
           "score": 85
         },
         {
           "name": "좋은 활동명2",
           "score": 90
         }
       ],
       "badActivities": [
         {
           "name": "안좋은 활동명",
           "score": 40
         },
         {
           "name": "안좋은 활동명2",
           "score": 30
         }
       ]
     }
   }
`,
      },
      {
        role: 'user',
        content: `사용자의 다이어리 데이터는 다음과 같습니다:\n\n${diaryContent}`,
      },
    ],
  })

  const gptResponse = JSON.parse(response.choices[0].message.content as string)

  for (const activity of gptResponse.activities.goodActivities) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/search-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: activity.name.split(' ') }),
      },
    )
    const { url } = await response.json()
    activity.image = url
  }
  for (const activity of gptResponse.activities.badActivities) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/search-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: activity.name.split(' ') }),
      },
    )
    const { url } = await response.json()
    activity.image = url
  }

  return NextResponse.json(gptResponse, { status: 200 })
}
