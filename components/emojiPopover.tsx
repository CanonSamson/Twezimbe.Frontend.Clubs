import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

interface EmojiPopoverProps {
  children: React.ReactNode
  hint?: string
  onEmojiSelect: (value: string) => void
  side?: 'top' | 'right' | 'bottom' | 'left' | undefined
  disabled?: boolean
}

const EmojiPopover = ({
  children,
  hint = 'Emoji',
  side = 'top',
  onEmojiSelect,
  disabled = false
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const onSelect = (value: any) => {
    console.log(value, "value")
    onEmojiSelect(value.native)
    setPopoverOpen(false)

    setTimeout(() => {
      setTooltipOpen(false)
    }, 100)
  }
  return (
    <TooltipProvider>
      <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
        <Tooltip
          onOpenChange={setTooltipOpen}
          open={tooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger disabled={disabled} asChild>{children}</TooltipTrigger>
          </PopoverTrigger>

          <TooltipContent
            side='top'
            align='center'
            className='bg-black text-white border border-white/5'
          >
            <p className='font-medium text-xs'>{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          side={side}
          align='center'
          className='p-0 border-none shadow-none bg-white'
        >
          <Picker
            data={data}
            onEmojiSelect={onSelect}
            theme='light'
            className='!bg-white'
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}

export default EmojiPopover
