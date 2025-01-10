import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import useModal from '@/hooks/useModal'
import WriteModal from '../ui/writemodal'
import EmotionImage from '../ui/emotion'

interface CalendarProps {
  currentDate: dayjs.Dayjs
}

const Calendar = ({ currentDate }: CalendarProps) => {
  const yoil = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const year = currentDate.year()
  const month = currentDate.month()
  const todayDate = dayjs().date()

  const { isOpen, openModal, closeModal } = useModal()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [diaryData, setDiaryData] = useState<Record<string, string | null>>({})

  useEffect(() => {
    const fetchDiaryData = async () => {
      try {
        const response = await fetch('/api/diary')
        if (!response.ok) throw new Error('Failed to fetch data')
        const result = await response.json()

        const diaryMap = result.reduce(
          (acc: Record<string, string>, diary: any) => {
            acc[dayjs(diary.date).format('YYYY-MM-DD')] = diary.emotionType
            return acc
          },
          {},
        )

        setDiaryData(diaryMap)
      } catch (error) {
        console.error(error)
      }
    }

    fetchDiaryData()
  }, [])

  const getDaysInMonth = (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const prevMonthDays = new Date(year, month, 0).getDate()

    const calendar = []
    let currentWeek = []

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      currentWeek.push({ day: prevMonthDays - i, isCurrentMonth: false })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({ day, isCurrentMonth: true })
      if (currentWeek.length === 7) {
        calendar.push(currentWeek)
        currentWeek = []
      }
    }

    for (let i = 1; currentWeek.length < 7; i++) {
      currentWeek.push({ day: i, isCurrentMonth: false })
    }
    if (currentWeek.length > 0) {
      calendar.push(currentWeek)
    }

    return calendar
  }

  const calendar = getDaysInMonth(year, month)

  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return
    const clickedDate = dayjs(new Date(year, month, day)).format('YYYY-MM-DD')
    setSelectedDate(clickedDate)
    openModal()
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full justify-between px-3">
        {yoil.map((day) => (
          <div
            key={day}
            className={`border-t border-b border-r border-[#E0E0E0] font-nanum text-[#393939] w-full py-1 text-[26px] ${
              day === 'Sa' ? 'border-r-0' : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="flex w-full flex-col gap-4 bg-white pt-3">
        {calendar.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="relative flex items-center justify-between bg-white border-t border-b"
          >
            {week.map((date, dayIndex) => {
              const formattedDate = dayjs(
                new Date(year, month, date.day),
              ).format('YYYY-MM-DD')
              const emotion = diaryData[formattedDate] || null

              return (
                <div
                  key={dayIndex}
                  className={`flex w-full h-[55px] items-center justify-center font-inter text-[14px] text-center cursor-pointer ${
                    date.isCurrentMonth
                      ? 'border-t-[2.5px] border-b-[2.5px] border-[#D9D9D9] text-[#7F7F7F]'
                      : 'text-[#bcbcbc]'
                  } ${
                    date.isCurrentMonth &&
                    date.day === todayDate &&
                    currentDate.month() === dayjs().month() &&
                    currentDate.year() === dayjs().year()
                      ? 'text-[#FFA09C] font-semibold text-[16px]'
                      : ''
                  }`}
                  onClick={() => handleDateClick(date.day, date.isCurrentMonth)}
                >
                  <div className="flex gap-2 items-center">
                    {date.isCurrentMonth && emotion ? (
                      <EmotionImage
                        emotion={emotion as any}
                        showText={false}
                        isSelected={true} // 항상 불투명하게
                      />
                    ) : (
                      <>
                        <span className="bg-[#F0F0F0] w-5 h-[2px] rounded"></span>
                        {date.day}
                        <span className="bg-[#F0F0F0] w-5 h-[2px] rounded"></span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* WriteModal */}
      {isOpen && <WriteModal initialDate={selectedDate} onClose={closeModal} />}
    </div>
  )
}

export default Calendar
