import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { prisma } from '@/lib/prisma'
import { gptResponse } from '../recommendation/route'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
})

export const POST = async () => {
  const diaries = await prisma.diary.findMany({
    where: {
      userId: process.env.NEXT_PUBLIC_USER_ID,
    },
    orderBy: {
      date: 'asc',
    },
  })

  if (!diaries || diaries.length === 0) {
    return NextResponse.json({ error: '다이어리가 없습니다.' }, { status: 404 })
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
        content: `사용자의 다이어리 데이터를 분석하여 적합한 직업 계통과 직업을 추천하세요. 분석 결과는 반드시 JSON 형식으로 반환해야 합니다.

          1. **분석 대상**:
            - 이공계, 인문사회계, 예체능계, 경영계, 교육계, 의료계 등 주요 직업 계통.

          2. **분석 기준**:
            - 각 계통에 대한 적합도를 0~100%로 계산하세요.
              - 모든 계통의 합은 100이어야 한다.
            - 적합도 계산 시 다음 요소를 고려하세요:
              - 사용자의 활동 내용.
              - 감정 유형과 점수.
              - 활동의 이유.
            - 예시:
              - 분석적인 작업, 문제 해결 → 이공계 적합도 상승.
              - 창의적이고 표현력 중심의 작업 → 예체능계 적합도 상승.

          3. **출력 형식**:
            JSON 형식으로 반환:
            {
              "sectors": [
                {
                  "name": "직업 계통 이름",
                  "fitPercentage": 70,
                  "reasoning": "적합성에 대한 설명",
                  "jobs": [
                    { "name": "추천 직업 이름", "description": "직업에 대한 설명" },
                    { "name": "추천 직업 이름 2", "description": "직업에 대한 설명 2" }
                  ]
                }
              ]
            }`,
      },
      {
        role: 'user',
        content: `사용자의 다이어리 데이터는 다음과 같습니다:\n\n${diaryContent}`,
      },
    ],
  })

  const gptResponse: gptResponse = JSON.parse(
    response.choices[0].message.content as string,
  )

  const dbResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/recommendation`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gptResponse),
    },
  )

  if (!dbResponse.ok) {
    return NextResponse.json(
      { error: '추천 데이터 저장에 실패했습니다.' },
      { status: 500 },
    )
  }

  return NextResponse.json(response.choices[0].message.content, { status: 201 })
}
