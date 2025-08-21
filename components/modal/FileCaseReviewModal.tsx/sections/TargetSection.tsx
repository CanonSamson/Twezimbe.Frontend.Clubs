const TargetSection = ({ targetAmount }: { targetAmount: string }) => {
  return (
    <div className='flex  min-h-[100px] flex-wrap justify-start'>
      <div className='pb-10 pl-5'>
      <h1 className='text-[14px] font-bold mb-5 text-left'>UGX {targetAmount}</h1>
      </div>
    </div>
  )
}

export default TargetSection
