const GroupRecommendedCardLoader = () => {
  return (
    <div className="w-full bg-white flex flex-col text-gray-500 rounded-lg shadow-xl shadow-[#f2f2f2] overflow-hidden ">
      {/* Image skeleton */}
      <div className="h-28 tablet:h-48  bg-slate-300 w-full" />

      <div className="p-4 flex flex-col justify-between">
        {/* Title and description skeleton */}
        <div>
          <div className="h-6 bg-gray-300 rounded-md w-3/4 mb-2" />
          <div className="h-4 bg-gray-300 rounded-md w-full" />
        </div>

        {/* Member count and button skeleton */}
        <div className="flex flex-col text-[14px] mt-4">
          <div className="flex max-tablet-lg:flex-col pb-4 w-full tablet:justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-gray-300 rounded-full" />
              <div className="h-4 bg-gray-300 rounded-md w-20" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-gray-300 rounded-full" />
              <div className="h-4 bg-gray-300 rounded-md w-28" />
            </div>
          </div>
          <div className="h-10 bg-gray-300 rounded-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default GroupRecommendedCardLoader;
