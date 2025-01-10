'use client'

import { Icon } from '@iconify/react'

const NavigationBar = ({
  navigation,
  setNavigation,
}: {
  navigation: string
  setNavigation: (value: string) => void
}) => {
  const handleClick = (value: string) => {
    setNavigation(value) // Update the navigation state
  }

  return (
    <div className="flex w-full items-center justify-around bg-white font-nanum text-[22px] py-1 border-t border-b border-t-1 border-b-1 border-[#D9D9D9] px-6">
      <div
        className="flex flex-col gap-1 items-center cursor-pointer"
        onClick={() => handleClick('analyze')}
      >
        <Icon
          icon="fluent-mdl2:sentiment-analysis"
          className={`w-[31px] h-[31px] ${navigation === 'analyze' ? 'opacity-100' : 'opacity-50'}`}
        />
        <p
          className={`${navigation === 'analyze' ? 'opacity-100' : 'opacity-50'}`}
        >
          분석
        </p>
      </div>
      <div
        className="flex flex-col gap-1 items-center cursor-pointer"
        onClick={() => handleClick('home')}
      >
        <Icon
          icon="hugeicons:pencil"
          className={`w-[31px] h-[31px] ${navigation === 'home' ? 'opacity-100' : 'opacity-50'}`}
        />
        <p
          className={`${navigation === 'home' ? 'opacity-100' : 'opacity-50'}`}
        >
          홈
        </p>
      </div>
      <div
        className="flex flex-col gap-1 items-center cursor-pointer"
        onClick={() => handleClick('course')}
      >
        <Icon
          icon="solar:branching-paths-down-broken"
          className={`w-[31px] h-[31px] ${navigation === 'course' ? 'opacity-100' : 'opacity-50'}`}
        />
        <p
          className={`${navigation === 'course' ? 'opacity-100' : 'opacity-50'}`}
        >
          진로
        </p>
      </div>
    </div>
  )
}

export default NavigationBar
