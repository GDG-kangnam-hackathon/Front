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
Analyze the user's diary data and recommend suitable job sectors and specific jobs. The analysis result must be returned in JSON format.

1. **Target of Analysis**:
  - Main job sectors: Science and Engineering, Humanities and Social Sciences, Arts and Sports, Business, Education, Medical fields.
  - Exclude sectors with 0% suitability from the analysis result.
    - At least one sector must be included.

2. **Criteria for Analysis**:
  - Calculate suitability for each sector between 0% and 100%.
    - The total sum of suitability percentages across all sectors must equal 100.
  - Consider the following elements when calculating suitability:
    - User's activities.
    - Emotional types and scores.
    - Reasons for activities.
    - **Add additional weight to sectors matching the user's jobField information.**
      - Example: If the user's jobField is "Science and Engineering," apply extra weighting to activities related to problem-solving and logical thinking.
  - Assign a weight of 0.1 to transient events or data unrelated to career paths, so they have minimal impact on the analysis. Example: "I enjoyed the meal," "It was fun catching up with a friend after a long time."
  - Increase weighting for specific topics or activities repeated in the diary.
    - Example: Repeated problem-solving -> Increased suitability for Science and Engineering.
    - Example: Repeated creative activities -> Increased suitability for Arts and Sports.

3. **Output Format**:
  Return the results in JSON format:
  {
    "sectors": [
      {
        "name": "Sector Name",
        "fitPercentage": 20,
        "reasoning": "Detailed explanation of why this sector is suitable",
        "jobs": [
          { 
            "name": "Recommended Job Name 1", 
            "description": "Explanation of why this job is recommended and how it relates to the sector's suitability",
            "image": "URL for an example image of the recommended job"
          },
          { 
            "name": "Recommended Job Name 2", 
            "description": "Explanation of why this job is recommended and how it relates to the sector's suitability",
            "image": "URL for an example image of the recommended job"
          },
          { 
            "name": "Recommended Job Name 3", 
            "description": "Explanation of why this job is recommended and how it relates to the sector's suitability",
            "image": "URL for an example image of the recommended job"
          }
        ]
      }
      // Other sectors with non-zero suitability will follow the same format
    ]
  }

4. **Job Recommendations**:
  - Recommend at least three jobs for each sector with non-zero suitability.
  - Select jobs based on the user's activities, emotional patterns, and sector suitability, and provide reasons instead of job descriptions.
  - The recommendations should naturally and friendly connect with the sector's suitability.

5. **Analysis Steps**:
  - Analyze the user's diary data in detail to identify patterns in activities and emotions.
  - Extract career-related insights from the patterned data, then calculate suitability percentages for each job sector.
  - Ignore or assign a low weight to transient and career-unrelated data to minimize their influence on the analysis.
  - Exclude sectors with 0% suitability from the final results.

6. **Tone Guidelines**:
  - When writing the reasoning and job recommendations, avoid overly formal or academic expressions. Instead, use a friendly and easily understandable tone.
  - Example: "You seem to concentrate well when solving problems lately, so I think Science and Engineering suits you." or "You’ve mentioned drawing often in your diary, which suggests a great match with the Arts and Sports sector." Use a conversational tone, as if you're talking to a friend.
`,
      },
      {
        role: 'user',
        content: `The user's diary data is as follows:\n\n${diaryContent}\n\nUser's jobField: ${user?.jobField}`,
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
