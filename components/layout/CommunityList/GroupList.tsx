import { useSettingModal } from "@/contexts/modal-setting";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { UserGroupListType } from "@/types/groups";
import { getNameInitials } from "@/utils/functions/getNameInitials";
import Loader from "./loader";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { groupBaseUrl } from "@/utils/navigation";
import { useSiderBar } from "@/contexts/siderbar";

const GroupList = () => {
  const { modals, toggleModal } = useSettingModal();

  const groupList = useSelector((state: RootState) => state.group.groupList);
  const unreadGroupMessageCounts = useSelector(
    (state: RootState) => state.groupMessage.unreadGroupMessageCounts
  );
  const { fetchGroupList: isLoading } = useSelector(
    (state: RootState) => state.group.loading
  );
  const pathName = usePathname();
  const { groupId, channelId } = useParams();
  const router = useRouter();

  const Components = (props: UserGroupListType) => {
    const [hover, setHover] = useState(false);
    const [tooltipY, setTooltipY] = useState(0);

    const { siderWidth } = useSiderBar();

    const itemRef = useRef<HTMLButtonElement>(null);

    const handleMouseEnter = () => {
      setHover(true);
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        const y = rect.top + window.scrollY;
        if (y) {
          setTooltipY(y);
        }
      }
    };

    const handleMouseLeave = () => {
      setHover(false);
      setTooltipY(0);
    };

    const handleNavigate = () => {
      router.push(groupBaseUrl(props.id, props.channels[0].id));
    };

    const inGroup =
      pathName.includes(`/groups/${props.id}`) ||
      pathName.includes(`/bf/${props.id}`);

    return (
      <>
        <span
          className={cn(
            "shadow-xl z-[100] fixed duration-700 transition-all rounded-[12px]",
            "text-left font-normal items-center justify-center text-[14px]",
            hover ? " hidden tablet-lg:flex" : "hidden",
            "ml-[90px] w-[150px] h-[40px] p-1",
            "bg-white text-primary"
          )}
          style={{ top: tooltipY, left: siderWidth }}
        >
          {props.name}
        </span>
        <div
          className="  text-[12px]  prevent-select  relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={cn(
              " w-full px-1 flex relative  items-center justify-center mt-[10px] tablet:mt-[17px] hover:opacity-70",
              inGroup && "border-r-[3px] border-r-primary rounded-l-full"
            )}
            onClick={() => {
              handleNavigate();
            }}
            onMouseEnter={handleMouseEnter}
            ref={itemRef}
          >
            {props.unSeenCount !== 0 && (
              <div className="flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full absolute right-0 tablet:right-2 -bottom-1 z-[20] bg-secondary text-white text-xs">
                {props.unSeenCount > 99 ? "99+" : props.unSeenCount}
              </div>
            )}

            {!props?.iconImage?.trim() ? (
              <div
                className="w-[45px] aspect-square rounded-xl
             bg-white flex items-center justify-center uppercase 
              text-primary text-[24px] font-semibold"
              >
                {getNameInitials(props?.name)}
              </div>
            ) : (
              <Image
                src={props?.iconImage || ""}
                className={` w-[50px] aspect-square rounded-xl 
            ${
              !props?.iconImage && "hidden"
            }   object-cover bg-white flex items-center justify-center `}
                width={45}
                height={45}
                alt={"YC EC"}
                priority={true}
              />
            )}

            {true ? (
              <div className="absolute right-[10px] bottom-[-6px]">
                <div className="relative w-[20px] h-[20px]"></div>
              </div>
            ) : null}

            <div
              className={`absolute border-r-[3px] rounded-l-full  h-full right-0 duration-300 transition-all ${
                hover ? "border-r-primary" : " border-transparent"
              }`}
            />
          </button>
        </div>
      </>
    );
  };

  const hidden =
    (!!groupId && !!channelId) ||
    (!pathName.includes("groups") && !pathName.includes("bf"));

  if (isLoading) return <Loader />;

  return (
    <div
      className={cn(
        "w-[65px] tablet:min-w-[80px] tablet:w-[80px]",
        " max-tablet-lg:h-[100dvh]",
        "relative justify-center",
        "overflow-y-scroll overflow-x-visible",
        "pb-4 scrollbar-hide bg-[#88B7D8]",
        hidden ? "hidden tablet-lg:block" : "tablet-lg:block"
      )}
    >
      <div className="block relative">
        <div className="w-full  flex items-center justify-center mb-[30px] relative">
          <button
            onClick={() => {
              router.push("/groups/create");
            }}
            className="h-[45px] tablet-lg:hidden w-[45px] mt-[60px] bg-primary bg-opacity-100 rounded-[12px] flex items-center justify-center hover:opacity-70"
          >
            <AiOutlineClose
              size={24}
              className={`${
                modals.newGroupModal ? "" : " rotate-45"
              } duration-500 transition-all text-white`}
            />
          </button>
          <button
            className="h-[45px] max-tablet-lg:hidden w-[45px] mt-[60px] bg-primary bg-opacity-100 rounded-[12px] flex items-center justify-center hover:opacity-70"
            onClick={() => toggleModal("newGroupModal")}
          >
            <AiOutlineClose
              size={24}
              className={`${
                modals.newGroupModal ? "" : " rotate-45"
              } duration-500 transition-all text-white`}
            />
          </button>
        </div>

        {groupList?.map((group, index) => {
          return (
            <Components
              key={index}
              {...group}
              unSeenCount={unreadGroupMessageCounts?.[group.id] || 0}
            />
          );
        })}
        <div className=" h-[75px] w-[1px] relative" />
      </div>
    </div>
  );
};

export default GroupList;
