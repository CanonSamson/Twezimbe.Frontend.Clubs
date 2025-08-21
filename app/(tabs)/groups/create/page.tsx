import CreateGroupComponent from "@/components/group/create/CreateGroupComponent";

const CreateGruop = () => {
  return (
    <div className={`w-full bg-[#88B7D8] `}>
      <div
        className={` overflow-y-auto pb-[100px] bg-white w-full tablet-lg:w-[250px]  mt-[1dvh] max-tablet-lg:h-[99dvh] flex flex-col  border-r  rounded-tl-[40px] `}
      >
        <CreateGroupComponent />
      </div>
    </div>
  );
};

export default CreateGruop;
