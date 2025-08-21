import moment from 'moment'

const MessageTime = ({
  hidden,
  timestamp,
  firstUnreadMessage,
  isSameDay
}: {
  hidden: boolean
  timestamp: string | Date
  firstUnreadMessage: boolean
  isSameDay: boolean
}) => {
  const getRelativeTime = () => {
    const momentDate = moment(timestamp)
    const today = moment().startOf('day')
    const yesterday = moment().subtract(1, 'day').startOf('day')

    if (momentDate.isSame(today, 'day')) {
      return 'Today'
    } else if (momentDate.isSame(yesterday, 'day')) {
      return 'Yesterday'
    } else {
      return momentDate.format('MMMM D, YYYY')
    }
  }

  return (
    <div className={`w-full px-10 pb-4  mt-5 ${hidden ? 'hidden' : 'block'}`}>
      <div className=' w-full flex-1 flex items-center justify-center group'>
        <div
          className={`flex relative h-[1px]  flex-1  ${
            firstUnreadMessage ? 'bg-secondary' : 'bg-[#DDDDDD]'
          } `}
        />
        <p className='rounded-full px-4 py-2 border-[#DDDDDD] bg-divider-100 border text-[12px]'>
          {isSameDay ?`${getRelativeTime()} - ${moment(timestamp).format('h:mm A')}` : getRelativeTime()}
        </p>
       <div className=' flex-1  flex items-center gap-2 '>
       <div
          className={`flex relative h-[1px]  flex-1  ${
            firstUnreadMessage ? 'bg-secondary' : 'bg-[#DDDDDD]'
          } `}
        />{' '}
        {firstUnreadMessage && <div className=' text-secondary'>New </div>}
       </div>
      </div>
    </div>
  )
}

// [.sticky_&]:opacity-0
// [.sticky_&]:opacity-0
// sticky top-4

export default MessageTime
