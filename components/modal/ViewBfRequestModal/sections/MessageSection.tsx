const MessageSection = ({ message }: { message: string }) => {
  return (
    <div className='flex  min-h-[200px] flex-wrap justify-start'>
      <div className='pb-10 pl-5'>
        <span>{message}</span>
      </div>
    </div>
  )
}

export default MessageSection
