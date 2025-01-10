import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { prisma } from '@/lib/prisma'
import { gptResponse } from '../../recommendation/route'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
})

export const POST = async () => {
  const user = await prisma.user.findUnique({
    where: {
      id: process.env.USER_ID,
    },
  })

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
        content: `
사용자의 다이어리 데이터를 분석하여 적합한 직업 계통과 직업을 추천하세요. 분석 결과는 반드시 JSON 형식으로 반환해야 합니다.

1. **분석 대상**:
  - 주요 직업 계통: 이공계, 인문사회계, 예체능계, 경영계, 교육계, 의료계.
  - 분석 결과에서 적합도가 0%인 계통은 제외하세요. 
    - 최소 하나 이상의 계통은 반드시 포함되어야 합니다.

2. **분석 기준**:
  - 각 계통에 대한 적합도를 0 이상 100% 이하로 계산하세요.
    - 모든 계통의 합은 반드시 100이어야 합니다.
  - 적합도 계산 시 다음 요소를 고려하세요:
    - 사용자의 활동 내용.
    - 감정 유형과 점수.
    - 활동의 이유.
    - **사용자의 jobField 정보와 일치하는 계통은 가중치를 추가로 부여하세요.**
      - 예: 사용자의 jobField가 "이공계"인 경우, 문제 해결, 논리적 사고 등 이공계 활동에 추가 가중치 적용.
  - 일시적인 이벤트나 진로와 관련성이 낮은 데이터는 가중치를 0.1로 설정하여 매우 낮게 반영하세요. 예: "식사가 좋았다", "친구와 오랜만에 만나 즐거웠다."
  - 특정 주제나 활동이 일기에서 반복될수록 가중치를 증가시키세요.
    - 예: 반복적인 문제 해결 -> 이공계 적합도 증가.
    - 예: 반복적인 창의적 활동 -> 예체능계 적합도 증가.

3. **출력 형식**:
  JSON 형식으로 반환:
  {
    "sectors": [
      {
        "name": "직업 계통 이름",
        "fitPercentage": 20,
        "reasoning": "해당 계통이 적합한 이유에 대한 구체적인 설명",
        "jobs": [
          { 
            "name": "추천 직업 이름 1", 
            "description": "이 직업을 추천하는 이유와 계통 적합성과의 연관성 설명",
            "image": "추천 직업 예시 이미지 URL 1"
          },
          { 
            "name": "추천 직업 이름 2", 
            "description": "이 직업을 추천하는 이유와 계통 적합성과의 연관성 설명",
            "image": "추천 직업 예시 이미지 URL 2"
          }
        ]
      }
      // 적합도가 0%가 아닌 다른 계통들도 동일 형식으로 반환
    ]
  }

4. **추천 직업 구성**:
  - 적합도가 0%가 아닌 각 직업 계통마다 최소 2개의 직업을 반드시 추천하세요.
  - 추천 직업은 사용자의 활동 내용, 감정 패턴, 계통 적합성을 기반으로 선정하며, 직업 설명 대신 추천 이유를 적어주세요.
  - 추천 이유는 계통의 적합성과 연관지어 자연스럽고 친근한 말투로 작성하세요.

5. **분석 단계**:
  - 사용자의 일기 데이터를 구체적으로 분석하여 활동과 감정의 패턴을 파악하세요.
  - 패턴화된 데이터에서 진로와 관련된 의미를 추출한 후, 직업 계통별 적합도를 계산하세요.
  - 일시적이고 진로와 무관한 데이터는 무시하거나 가중치를 낮게 설정하여 분석에 반영합니다.
  - 적합도가 0%인 계통은 최종 결과에서 제외하세요.

6. **말투 지침**:
  - 이유와 추천 직업 설명을 작성할 때는 딱딱한 학술적 표현 대신, 친근하고 이해하기 쉬운 말투로 작성하세요.
  - 예: "너가 요즘 문제를 풀 때 집중을 잘하는 것 같아. 그래서 이공계랑 잘 맞을 것 같아." 또는 "일기에서 그림 그리는 걸 자주 얘기했잖아. 이건 예체능 계통이랑 찰떡일 가능성이 커 보여." 등 사용자와 친구처럼 대화하는 느낌으로 작성하세요.
`,
      },
      {
        role: 'user',
        content: `사용자의 다이어리 데이터는 다음과 같습니다:\n\n${diaryContent}\n\n사용자의 jobField: ${user?.jobField}`,
      },
    ],
  })

  const gptResponse: gptResponse = JSON.parse(
    response.choices[0].message.content as string,
  )

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recommendation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gptResponse),
  })

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/recommendation`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  const data = await res.json()

  return NextResponse.json(data, { status: 201 })
}
