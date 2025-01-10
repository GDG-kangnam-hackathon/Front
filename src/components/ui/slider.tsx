import React, { useState } from 'react'

interface SliderProps {
  max: number
  onChange?: (value: number) => void
}

const Slider: React.FC<SliderProps> = ({ max, onChange }) => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value)
    setValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <div className="relative w-full">
      {/* 슬라이더 트랙 */}
      <div className="w-full h-1 bg-gray-300 rounded-full relative">
        <div
          className="absolute h-1 bg-custom-green rounded-full"
          style={{ width: `${(value / max) * 100}%` }}
        ></div>

        <div className="absolute inset-0 flex justify-between">
          {Array.from({ length: max + 1 }, (_, i) => (
            <div
              key={i}
              className={`absolute top-0.5 h-[20px] w-[20px] rounded-full transform -translate-y-1/2 ${
                i <= value ? 'bg-custom-green' : 'bg-gray-400'
              }`}
              style={{ left: `${(i / max) * 100}%` }}
            ></div>
          ))}
        </div>
      </div>

      {/* 슬라이더 핸들 및 점수 표시 */}
      <div
        className="ml-[5px] top-[-12px] absolute flex flex-col items-center -translate-x-1/2"
        style={{ left: `${(value / max) * 100}%` }}
      >
        <div className="h-[30px] w-[30px] bg-custom-green border-2 border-white rounded-full"></div>
        <div className="relative">
          <img
            src="./images/union.svg"
            alt="점수 말풍선"
            className="h-10 w-10"
          />
          <span className="mr-[2.5px] font-nanum absolute inset-0 flex items-center justify-center text-center text-[25px] font-normal leading-normal">
            {value}점
          </span>
        </div>
      </div>

      {/* 숨겨진 range input */}
      <input
        type="range"
        min="0"
        max={max}
        step="1"
        value={value}
        onChange={handleChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  )
}

export default Slider
