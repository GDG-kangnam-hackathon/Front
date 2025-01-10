'use client'

import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, ChartData } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { EmotionDistribution } from '@/app/api/chatgpt/analyze/model'

// Chart.js 구성요소 등록
ChartJS.register(ArcElement, ChartDataLabels)

const Statistics = ({
  emotionDistribution,
}: {
  emotionDistribution: EmotionDistribution
}) => {
  // 원그래프 데이터 준비
  const data: ChartData<'pie'> = {
    labels: Object.keys(emotionDistribution),
    datasets: [
      {
        data: Object.values(emotionDistribution),
        backgroundColor: [
          '#FAD2D0',
          '#B4DDFF',
          '#FF7E77',
          '#FBB22E',
          '#08A075',
        ], // 각 구간의 색상
        borderWidth: 0, // 경계선 두께
      },
    ],
  }

  // 퍼센트 라벨 설정
  const options = {
    plugins: {
      datalabels: {
        color: '#fff', // 글자 색상
        font: {
          family: 'KoPubWorldBatang',
          weight: 'bold',
          size: 30,
        },
        formatter: (value: number, ctx: any) => {
          let total = 0
          let dataArr = ctx.chart.data.datasets[0].data
          dataArr.forEach((item: number) => {
            total += item
          })
          const percentage = ((value / total) * 100).toFixed(0) + '%'

          // 폰트 크기 조정 (가장 큰 값일수록 폰트 크기 증가)
          const fontSize = Math.max(16, 30 * (value / total)) // 가장 큰 값에서 30으로 크기 비례
          ctx.chart.options.plugins.datalabels.font.size = fontSize

          return percentage
        },
      },
    },
  }

  return (
    <div className="w-64 flex justify-center items-center">
      <Pie data={data} options={options} />
    </div>
  )
}

export default Statistics
