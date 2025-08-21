import { DmMessageType } from '@/api/dms/messaging'
import { MessageType } from '@/api/messaging/group'
import { useSettingModal } from '@/contexts/modal-setting'
import Image from 'next/image'

const ImageCard = ({
  url,
  lastImage,
  hasNextFiles,
  remainingFilesCount,
  files,
  index,
  message
}: {
  url: string
  lastImage: boolean
  files: {
    name: string
    size: number
    url: string
    type: string
  }[]
  hasNextFiles: boolean
  remainingFilesCount: number
  index: number
  message: MessageType | DmMessageType
}) => {
  const { toggleModal } = useSettingModal()
  return (
    <div
      onClick={e => {
        e.stopPropagation()
        toggleModal('previewFilesModal', {
          files: files,
          index,
          user: message?.user,
          createdAt: message?.createdAt,
          message: message
        })
      }}
      className=' w-[200px] h-[200px] relative '
    >
      <Image
        src={url}
        alt='Uploaded file'
        className=' h-full w-full object-cover z-20  rounded-lg'
        width={100}
        height={100}
      />

      <div
        className={`${
          lastImage && hasNextFiles ? 'bg-black/30' : ''
        } top-0 items-center rounded-lg justify-center   right-0 text-xl   z-30 flex   w-full h-full absolute`}
      >
        {lastImage && hasNextFiles ? (
          <p className=' text-white'>+{remainingFilesCount + 1}</p>
        ) : null}
      </div>
    </div>
  )
}

export default ImageCard
