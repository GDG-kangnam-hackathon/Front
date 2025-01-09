import dayjs from 'dayjs'

interface CalendarProps {
  currentDate: dayjs.Dayjs // 부모 컴포넌트에서 넘겨받은 currentDate
}

const Calendar = ({ currentDate }: CalendarProps) => {
  const yoil = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const year = currentDate.year() // currentDate에서 연도 가져오기
  const month = currentDate.month() // currentDate에서 월 가져오기 (0 = 1월, 1 = 2월, ...)
  const todayDate = dayjs().date() // 오늘 날짜

  // 현재 년도와 월을 기준으로 날짜 계산
  const getDaysInMonth = (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // 전달의 마지막 날 계산
    const prevMonthDays = new Date(year, month, 0).getDate()

    const calendar = []
    let currentWeek = []

    // 첫 번째 주: 전달 날짜 채우기
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      currentWeek.push({ day: prevMonthDays - i, isCurrentMonth: false })
    }

    // 현재 달의 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({ day, isCurrentMonth: true })
      if (currentWeek.length === 7) {
        calendar.push(currentWeek)
        currentWeek = []
      }
    }

    // 마지막 주: 다음 달 날짜 채우기
    for (let i = 1; currentWeek.length < 7; i++) {
      currentWeek.push({ day: i, isCurrentMonth: false })
    }
    if (currentWeek.length > 0) {
      calendar.push(currentWeek)
    }

    return calendar
  }

  const calendar = getDaysInMonth(year, month)

  return (
    <div className="flex flex-col w-full">
      {/* 요일 헤더 */}
      <div className="flex w-full justify-between px-3">
        {yoil.map((day) => (
          <div
            key={day}
            className={`border-t border-b border-r border-[#E0E0E0] font-nanum text-[#393939] w-full py-1 text-[26px] ${day === 'Sa' ? 'border-r-0' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>
      {/* 날짜 */}
      <div className="flex w-full flex-col gap-4 bg-white pt-3">
        {calendar.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className={
              'flex items-center justify-between bg-white border-t border-b'
            }
          >
            {week.map((date, dayIndex) => (
              <div
                key={dayIndex}
                className={`flex w-full h-[55px] items-center justify-center font-inter text-[14px] text-cente cursor-pointer ${
                  date.isCurrentMonth
                    ? 'border-t-[2.5px] border-b-[2.5px] border-[##D9D9D9] text-[#7F7F7F]' // 현재 달 날짜 스타일
                    : 'text-[#bcbcbc]' // 다른 달 날짜 스타일
                } ${
                  date.isCurrentMonth && date.day === 1
                    ? 'border-l-[2.5px] rounded-l-full' // 첫 번째 날 둥근 스타일
                    : ''
                } ${
                  date.isCurrentMonth &&
                  weekIndex === calendar.length - 1 &&
                  dayIndex === week.filter((d) => d.isCurrentMonth).length - 1
                    ? 'border-r-[2.5px] rounded-r-full' // 마지막 날 둥근 스타일
                    : ''
                } ${
                  date.isCurrentMonth && // 오늘 날짜 빨간색
                  date.day === todayDate &&
                  currentDate.month() === dayjs().month() &&
                  currentDate.year() === dayjs().year()
                    ? 'text-[#FFA09C] font-semibold text-[16px]'
                    : ''
                }`}
                onClick={() => console.log('Clicked:', date.day)}
              >
                {date.day}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Calendar
