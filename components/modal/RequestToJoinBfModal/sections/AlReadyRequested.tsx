import Image from "next/image";

const AlReadyRequested = () => {
  const handleClose = () => {};
  return (
    <>
      <div className="flex flex-col items-center mt-8">
        <Image
          src="/icon/cup.svg"
          alt="Group42"
          width={400}
          height={400}
          className="mb-4  h-[200px] w-auto "
        />
        <h1 className="text-2xl font-bold mb-2">Hang in there...</h1>
        <p className="text-center mb-4 text-[12px]">
          Your request to Join this fund has been sent and you will be notified
          once your request is accepted or denied.
        </p>
        <div className=" w-full flex items-center justify-center">
          <button
            onClick={() => handleClose()}
            className=" flex items-center w-full rounded-md justify-center bg-primary text-white px-6 py-3 mt-2 mb-6"
          >
            <h1 className="">Close</h1>
          </button>
        </div>
      </div>
    </>
  );
};

export default AlReadyRequested;
