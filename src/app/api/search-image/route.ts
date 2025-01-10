import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { keyword } = body

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 },
      )
    }

    // Step 1: 이미지 경로 확인
    const imagePath = path.join(
      process.cwd(),
      'public',
      'images',
      'db',
      `${keyword}.jpg`,
    )
    const publicUrl = `/images/db/${keyword}.jpg`

    if (fs.existsSync(imagePath)) {
      // 이미지가 이미 존재하면 반환
      return NextResponse.json({ url: publicUrl }, { status: 200 })
    }

    // Step 2: 네이버 검색 API 호출
    const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID as string
    const NAVER_CLIENT_SECRET = process.env
      .NEXT_PUBLIC_NAVER_CLIENT_SECRET as string

    const response = await fetch(
      `https://openapi.naver.com/v1/search/image?query=${encodeURIComponent(`${keyword} 일러스트`)}&display=1`,
      {
        headers: {
          'X-Naver-Client-Id': NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
        },
      },
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch images from Naver API' },
        { status: response.status },
      )
    }

    const data = await response.json()
    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: 'No images found for the given keyword' },
        { status: 404 },
      )
    }

    // Step 3: 첫 번째 이미지 다운로드 및 저장
    const imageUrl = data.items[0].link
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to download image' },
        { status: imageResponse.status },
      )
    }

    const buffer = await imageResponse.arrayBuffer()
    fs.mkdirSync(path.dirname(imagePath), { recursive: true }) // 필요한 경우 폴더 생성
    fs.writeFileSync(imagePath, Buffer.from(buffer))

    // Step 4: 저장된 이미지 URL 반환
    return NextResponse.json({ url: publicUrl }, { status: 200 })
  } catch (error) {
    console.error('Error in manage-image API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
