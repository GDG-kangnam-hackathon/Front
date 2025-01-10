import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, ChartData } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { RecommendationSector } from '@prisma/client'
import React from 'react'

// Chart.js 구성 요소 등록
ChartJS.register(ArcElement, ChartDataLabels)

interface CourseChartProps {
  data: RecommendationSector[]
}

const CourseChart: React.FC<CourseChartProps> = ({ data }) => {
  const limitedData = data.slice(0, 6)

  // 차트 데이터 구성
  const chartData: ChartData<'pie'> = {
    labels: limitedData.map(
      (sector: RecommendationSector) => sector.sectorName,
    ),
    datasets: [
      {
        data: limitedData.map(
          (sector: RecommendationSector) => sector.fitPercentage,
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // 투명 빨강
          'rgba(54, 162, 235, 0.6)', // 투명 파랑
          'rgba(255, 206, 86, 0.6)', // 투명 노랑
          'rgba(75, 192, 192, 0.6)', // 투명 청록
          'rgba(153, 102, 255, 0.6)', // 투명 보라
          'rgba(255, 159, 64, 0.6)', // 투명 주황
        ],
        borderWidth: 0, // 테두리 두께 제거
      },
    ],
  }

  // 차트 옵션 구성
  const options = {
    plugins: {
      datalabels: {
        color: '#fff', // 글자 색상
        font: {
          family: 'KoPubWorldBatang',
          size: 40,
          weight: 'bold',
        },
        formatter: (value: number, ctx: any) => {
          let total = 0
          const dataArr = ctx.chart.data.datasets[0].data
          dataArr.forEach((item: number) => {
            total += item
          })
          const percentage = ((value / total) * 100).toFixed(0) + '%'

          // 폰트 크기 조정 (비례 크기)
          const fontSize = Math.max(16, 30 * (value / total))
          ctx.chart.options.plugins.datalabels.font.size = fontSize

          return percentage
        },
      },
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#FFF', // 테두리 색상
      },
    },
  }

  if (limitedData.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-64 flex justify-center items-center">
      <Pie data={chartData} options={options} />
    </div>
  )
}

export default CourseChart
