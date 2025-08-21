'use client'
import React from 'react'

interface TabButtonProps {
  tab: string
  selectedTab: string
  count?: number
  onClick: (tab: string) => void
  selected?: boolean
  className?: string
}

const TabButton = ({ 
  tab, 
  selectedTab, 
  count, 
  onClick, 
  selected = false,
  className = ''
}: TabButtonProps) => {
  return (
    <button
      className={`relative flex items-center justify-center gap-1 tablet:gap-2 font-medium px-2 tablet:px-3 py-1 tablet:py-1.5 text-sm tablet:text-[14px] text-[#475569] w-full ${className}`}
      onClick={() => onClick(tab)}
    >
      <div className="flex items-center gap-1">
        <span className="truncate">{tab}</span>
        {count && count !== 0 ? (
          <span className="bg-orange-500 text-white rounded-full min-w-[16px] tablet:min-w-[18px] h-4 tablet:h-[18px] flex items-center justify-center text-[10px] tablet:text-[11px] px-1">
            {count}
          </span>
        ) : null}
      </div>
      <span
        className={`absolute left-0 bottom-[-1px] tablet:bottom-[-1px] w-full h-[2px] tablet-lg:h-[3px] ${
          (selectedTab === tab || selected) ? 'bg-primary' : 'bg-transparent'
        }`}
      />
    </button>
  )
}

export default TabButton