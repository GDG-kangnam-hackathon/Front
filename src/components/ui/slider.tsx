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
    <div className="relative w-full items-center">
      <div className="w-full h-1 bg-gray-300 rounded-full relative">
        <div
          className="absolute h-1 bg-custom-green rounded-full"
          style={{ width: `${(value / max) * 100}%` }}
        ></div>

        <div className="absolute inset-0 flex justify-between">
          {Array.from({ length: max + 1 }, (_, i) => (
            <div
              key={i}
              className={`absolute top-0.5 h-[20px] w-[20px] rounded-full transform -translate-y-1/2 ${i <= value ? 'bg-custom-green' : 'bg-gray-400'}`}
              style={{ left: `${(i / max) * 100}%` }}
            ></div>
          ))}
        </div>
      </div>

      <div
        className="ml-3 top-6 absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
        style={{ left: `${(value / max) * 100}%` }}
      >
        <div className="h-[30px] w-[30px] bg-custom-green border-2 border-white rounded-full"></div>
        <div className="relative ">
          <img
            src="./images/union.svg"
            alt="점수 말풍선"
            className="h-11 w-11"
          />
          <span className="font-nanum text-2xl font-normal leading-normal mr-1 absolute inset-0 flex items-center justify-center text-xs text-gray-700 font-semibold">
            {value}점
          </span>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max={max}
        step="1"
        value={value}
        onChange={handleChange}
        className="absolute w-full h-2 opacity-0"
      />
    </div>
  )
}

export default Slider
