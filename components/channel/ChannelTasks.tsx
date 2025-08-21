import { LuBadgeCheck } from "react-icons/lu";
import { RiAdminLine } from "react-icons/ri";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { TbUserCog } from "react-icons/tb";
import { useSettingModal } from "@/contexts/modal-setting";
import { UserContext, UserContextType } from "@/contexts/user";
import { IconType } from "react-icons";
import { useParams, useRouter } from "next/navigation";
import { useContextSelector } from "use-context-selector";
import { useQuery } from "@tanstack/react-query";
import { getTaskStats } from "@/api/group";

interface Task {
  id: number;
  icon: IconType;
  title: string;
  description: string;
  buttonText: string;
  isCompleted?: boolean;
  handleClick?: () => void;
  count?: number;
}

const ChannelTasks = () => {
  const { toggleModal } = useSettingModal();
  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  );
  const groupId = useParams()?.groupId as string;

  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["getTaskStats", groupId],
    queryFn: () => getTaskStats(groupId as string),
  });

  const tasks: Task[] = [
    {
      id: 1,
      icon: LuBadgeCheck,
      title: "Group created",
      description: "You have successfully created a group on Twezimbe",
      buttonText: "Done",
      isCompleted: true,
      handleClick: () => {},
    },
    {
      id: 2,
      icon: RiAdminLine,
      title: "Add admin",
      description: "Add 2 admins to ensure the group stays active and managed",
      buttonText: "Add",
      count: data?.data.taskStats.invitedAdminsCount,
      isCompleted: !!data?.data.taskStats.hasTwoInvitedAdmins,
      handleClick: () => {
        toggleModal("inviteAdminsModal");
      },
    },
    {
      id: 3,
      icon: HiOutlineUserGroup,
      title: "Add Friends",
      description: "Add friends to start building your group",
      buttonText: "Add",
      count: data?.data.taskStats.invitedMembersCount,
      isCompleted: !!data?.data.taskStats.hasInvited,
      handleClick: () => {
        toggleModal("inviteFriendsModal");
      },
    },
    {
      id: 4,
      icon: TbUserCog,
      title: "Complete KYC",
      description:
        "Complete KYC to unlock the full functionalities of the group",
      buttonText: "Fill out",
      isCompleted: currentUser?.isKyc,
      handleClick: () => {
        if (!currentUser?.isKyc) {
          router.push("/settings/kyc/general");
        }
      },
    },
  ];

  const completedNum = tasks.filter((t) => t.isCompleted).length;
  const taskNum = tasks.length;

  return (
    <div className=" w-full ">
      <div className="bg-white mt-10  p-2 tablet-lg:p-5 rounded-[14px] tablet-lg:mx-10 mx-2">
        <div className="flex items-center justify-between tablet-lg:mb-5 mb-4">
          <span className="text-sm tablet-lg:text-lg font-medium">
            Quick Start Guide
          </span>
          <div className="flex flex-1 items-center justify-end gap-4">
            <span className="relative flex bg-[rgb(234,234,240)] h-[10px] w-[40%] rounded-full">
              <span
                className={`bg-[#108A00] absolute left-0 h-[10px] rounded-full duration-500 transition-all`}
                style={{ width: `${(completedNum / taskNum) * 100}%` }}
              />
            </span>
            <span className="text-[12px] tablet-lg:text-sm tablet-lg:font-medium">
              {completedNum} / {taskNum} Tasks Completed
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex justify-between items-center ${
                task.isCompleted ? "border border-[#108A00]" : ""
              } bg-[#F6F6F6] p-4 rounded-[14px]`}
              onClick={() => task.handleClick?.()}
              role={task.id === 2 ? "button" : undefined}
            >
              <div className="flex flex-1 items-center gap-4">
                <task.icon
                  size={24}
                  className={task.isCompleted ? "text-[#108A00]" : ""}
                />
                <div>
                  <span className="block text-[12px] tablet-lg:text-sm font-medium">
                    {task.title}
                  </span>
                  <span className="block text-[10px] tablet-lg:text-sm font-light">
                    {task.description}
                  </span>
                </div>
              </div>
              <div className=" flex items-center gap-2">
                {!task.isCompleted && task?.count && task?.count >= 1 ? (
                  <span className="text-[#108A00] border border-white px-2 py-1 rounded-full text-xs">
                    {task.count}
                  </span>
                ) : null}
                <button
                  className={`${
                    task.isCompleted
                      ? "bg-[#108A00] text-white"
                      : "bg-[#EAEAF0]"
                  } px-5 py-2 rounded-[10px] text-[10px] tablet-lg:text-sm`}
                >
                  {task.isCompleted ? "Done" : task.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelTasks;
