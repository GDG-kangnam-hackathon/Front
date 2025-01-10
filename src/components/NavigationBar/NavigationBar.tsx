'use client'

import { Icon } from '@iconify/react'
import { usePathname, useRouter } from 'next/navigation'

const NavigationBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const navigation = pathname.split('/').pop()

  return (
    <div className="flex w-full items-center justify-around bg-white font-nanum text-[22px] py-1 border-t border-b border-t-1 border-b-1 border-[#D9D9D9] px-6">
      <div
        className="flex flex-col gap-1 items-center cursor-pointer"
        onClick={() => router.push('/analyze')}
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
        onClick={() => router.push('/home')}
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
        onClick={() => router.push('/course')}
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
