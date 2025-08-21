'use client'

import { useSettingModal } from '@/contexts/modal-setting'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import { DialogProps } from '@radix-ui/react-dialog'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CustomDialogProps extends Partial<DialogProps> {
  name: string
  close: () => void
  children?: ReactNode
  contentClassName?: string
  disabled?: boolean
}

const CustomDialog = ({
  name,
  close,
  children,
  contentClassName,
  disabled,
  ...dialogProps
}: CustomDialogProps) => {
  const { modals, closeModal } = useSettingModal()

  const isOpen = modals[name]

  const handleClose = () => {
    close()
    closeModal(name)
  }

  const shouldRender = isOpen || !disabled

  return shouldRender ? (
    <Dialog
      open={isOpen}
      onOpenChange={(state: boolean) => {
        if (!disabled && state === false) {
          handleClose()
        }
      }}
      {...dialogProps}
    >
      <DialogContent
        className={cn(
          'z-[55]',
          'max-tablet-lg:fixed max-tablet-lg:bottom-0 max-tablet-lg:inset-x-0 max-tablet-lg:top-auto max-tablet-lg:translate-y-0 max-tablet-lg:transform-none max-tablet-lg:rounded-t-xl max-tablet-lg:rounded-b-none',
          contentClassName
        )}
      >
        {children}
      </DialogContent>
    </Dialog>
  ) : null
}

export default CustomDialog
