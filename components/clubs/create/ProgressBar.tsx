const ProgressBar = ({ step }: { step: number }) => {
  return (
    <div className='flex items-center mb-8'>
      <div className='flex items-center space-x-2'>
        <div className='w-3 h-3 bg-primary rounded-full'></div>
        <div
          className={
            step > 1
              ? 'w-3 h-3 bg-primary rounded-full'
              : 'w-3 h-3 bg-gray-300 rounded-full'
          }
        ></div>
        <div
          className={
            step > 2
              ? 'w-3 h-3 bg-primary rounded-full'
              : 'w-3 h-3 bg-gray-300 rounded-full'
          }
        ></div>
        <div
          className={
            step > 3
              ? 'w-3 h-3 bg-primary rounded-full'
              : 'w-3 h-3 bg-gray-300 rounded-full'
          }
        ></div>
      </div>
      <span className='ml-4 text-sm text-gray-600'>{step} of 4</span>
    </div>
  )
}

export default ProgressBar
