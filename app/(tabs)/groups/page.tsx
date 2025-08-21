import Image from "next/image";

const Group = () => {
  const isLoading = false;
  console.log(isLoading);
  return (
    <>
      <div className="row-start-1 col-start-2 bg-[#C3DBEC] border-b border-primary/50 p-4 h-16 flex items-center justify-between"></div>

      <div className="relative  row-start-2 col-start-2 p-4 flex flex-col h-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            width={400}
            height={400}
            alt="background"
            src="/essential/chat-background.png"
            className={`absolute inset-0 w-full h-full bg-white ${
              isLoading ? "z-[30]" : "z-0"
            }`}
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center z-[40] bottom-12">
            <Image
              width={300}
              height={300}
              alt="background202"
              src="/icon/pimaryarea.svg"
              className="w-[600px] h-[600px]"
              priority
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Group;
