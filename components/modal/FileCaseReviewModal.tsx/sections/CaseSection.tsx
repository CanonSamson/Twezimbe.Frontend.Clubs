const CaseSection = ({ caseData }: { caseData: any }) => {
  return (
    <div className='flex min-h-[100px] flex-wrap justify-start'>
      <div className='pb-10 pl-5'>
        <h1 className='text-[14px] font-bold mb-5 text-left'>
          {caseData?.description}
        </h1>
      </div>
    </div>
  )
}

export default CaseSection
