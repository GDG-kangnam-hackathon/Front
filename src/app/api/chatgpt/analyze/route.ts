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
Analyze the user's diary data and return the emotional distribution and the scores of major activities in JSON format. Classify activities as "good activities" or "bad activities" based on their scores.

1. **Analysis Targets**:
   - Emotional distribution (e.g., joy, sadness, happiness, anger, neutral).
   - Major activities (including activity names and scores).

2. **Analysis Criteria**:
   - Calculate emotional distribution in percentages for ["joy", "sadness", "happiness", "anger", "neutral"].
   - Ignore any diary entries where the emotion is "interest".
   - Activity scores are based on emotional scores:
     - Positive emotions (happiness, joy, etc.): 80~100 points.
     - Negative emotions (anger, stress, etc.): 1~50 points.
   - The more frequently an activity is repeated, the higher its score.
   - Activities with scores of 50 or more are classified as "good activities," and activities with scores below 50 are classified as "bad activities."
   - Limit both "good activities" and "bad activities" to a maximum of 3 each.

3. **Output Format**:
   JSON format:
   {
     "emotionDistribution": {
       "기쁨": 30,
       "슬픔": 30,
       "행복": 20,
       "화남": 10,
       "보통": 5
     },
     "activities": {
       "goodActivities": [
         {
           "name": "Good Activity Name",
           "score": 85
         },
         {
           "name": "Good Activity Name 2",
           "score": 90
         },
         {
           "name": "Good Activity Name 3",
           "score": 75
         }
       ],
       "badActivities": [
         {
           "name": "Bad Activity Name",
           "score": 40
         },
         {
           "name": "Bad Activity Name 2",
           "score": 30
         },
         {
           "name": "Bad Activity Name 3",
           "score": 25
         }
       ]
     }
   }

The final output must be returned in Korean, and any diary entries with the emotion "흥미" must be ignored.
`,
      },
      {
        role: 'user',
        content: `사용자의 다이어리 데이터는 다음과 같습니다:\n\n${diaryContent}`,
      },
    ],
  })

  const gptResponse = JSON.parse(response.choices[0].message.content as string)

  console.log(gptResponse)

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
