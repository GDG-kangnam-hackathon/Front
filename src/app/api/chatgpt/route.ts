import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
})

export const POST = async (req: NextRequest) => {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '유효하지 않은 prompt 값입니다.' },
        { status: 400 },
      )
    }
    console.log('API Key:', process.env.NEXT_PUBLIC_OPENAI_API_KEY)

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    })

    return NextResponse.json({ message: response.choices[0].message.content })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      { error: error.response?.data || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
