import { BasicUserBfType } from "@/api/group";
import { useSettingModal } from "@/contexts/modal-setting";
import { UserContext } from "@/contexts/user";
import useGroup from "@/hooks/userGroup";
import { hasBfPermission } from "@/utils/permissions/bf/bf-abac";
import { useParams, useRouter } from "next/navigation";
import { HiLockClosed } from "react-icons/hi";
import { IoChevronDownSharp } from "react-icons/io5";
import { useContextSelector } from "use-context-selector";

const BereavementFund = ({ bf }: { bf: BasicUserBfType }) => {
  const { handleToggleCollapse, collapsed } = useGroup();

  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  );
  const groupId = useParams()?.groupId as string;

  const router = useRouter();
  const { toggleModal } = useSettingModal();

  const roles = bf?.roles.map((r) => r.permission);
  
  return (
    <div className=" w-full">
      <button
        onClick={() => handleToggleCollapse(`bf-${bf.id}`)}
        className=" flex items-center gap-1 text-divider-300"
      >
        <IoChevronDownSharp
          size={16}
          className={`${
            collapsed[`bf-${bf.id}`] ? " -rotate-90 " : " rotate-0"
          } duration-300 `}
        />
        <span className="line-clamp-1">{bf.name}</span>

        {hasBfPermission(
          {
            blockedBy: [],
            id: currentUser?.id as string,
          },
          roles,
          "bfs",
          "create",
          { groupId: groupId as string, bfId: bf.id }
        ) ? null : (
          <HiLockClosed size={16} className=" text-divider-300" />
        )}
      </button>
      <div className={` ${collapsed[`bf-${bf.id}`] ? "hidden" : "false"}`}>
        {hasBfPermission(
          {
            blockedBy: [],
            id: currentUser?.id as string,
          },
          roles,
          "bfs",
          "view",
          { groupId: groupId as string, bfId: bf.id }
        ) ? (
          <div className=" flex flex-col gap-2 mt-2  w-full">
            {hasBfPermission(
              {
                blockedBy: [],
                id: currentUser?.id as string,
              },
              roles,
              "supervisor",
              "view",
              { bfId: bf?.id }
            ) && (
              <button
                onClick={() => {
                  router.push(`/bf/${groupId}/${bf.id}/supervisor`);
                }}
                className={`gap-2 pl-5 hover:bg-white rounded-[5px] flex items-center`}
              >
                supervisor
              </button>
            )}
            {hasBfPermission(
              {
                blockedBy: [],
                id: currentUser?.id as string,
              },
              roles,
              "beneficiary",
              "view",
              { bfId: bf?.id }
            ) && (
              <button
                onClick={() => {
                  router.push(`/bf/${groupId}/${bf.id}/beneficiary`);
                }}
                className={`gap-2 pl-5 hover:bg-white rounded-[5px] flex items-center`}
              >
                beneficiary
              </button>
            )}
            {hasBfPermission(
              {
                blockedBy: [],
                id: currentUser?.id as string,
              },
              roles,
              "manager",
              "view",
              { bfId: bf?.id }
            ) && (
              <button
                onClick={() => {
                  router.push(`/bf/${groupId}/${bf.id}/manager`);
                }}
                className={`gap-2 pl-5 hover:bg-white rounded-[5px] flex items-center`}
              >
                manager
              </button>
            )}
            {hasBfPermission(
              {
                blockedBy: [],
                id: currentUser?.id as string,
              },
              roles,
              "treasurer",
              "view",
              { bfId: bf?.id }
            ) && (
              <button
                onClick={() => {
                  router.push(`/bf/${groupId}/${bf.id}/treasurer`);
                }}
                className={`gap-2 pl-5 hover:bg-white rounded-[5px] flex items-center`}
              >
                treasurer
              </button>
            )}
            {hasBfPermission(
              {
                blockedBy: [],
                id: currentUser?.id as string,
              },
              roles,
              "admin",
              "view",
              { bfId: bf?.id }
            ) && (
              <button
                onClick={() => {
                  router.push(`/bf/${groupId}/${bf.id}`);
                }}
                className={`gap-2 pl-5 hover:bg-white rounded-[5px] flex items-center`}
              >
                admin
              </button>
            )}
            <button
              onClick={() => {
                router.push(`/bf/${groupId}/${bf.id}/principal`);
              }}
              className={`gap-2 pl-5  hover:bg-white rounded-[5px] flex items-center`}
            >
              principal
            </button>
            <button
              onClick={() => {
                router.push(`/bf/${groupId}/${bf.id}/wallet`);
              }}
              className={`gap-2 pl-5  hover:bg-white rounded-[5px] flex items-center`}
            >
              wallet
            </button>
            {bf?.transitionMembers && bf?.transitionMembers.length > 0 ? (
              <button
                onClick={() => {
                  toggleModal("transitionFundModal", bf);
                }}
                className={`gap-2 pl-5  hover:bg-white rounded-[5px] flex items-center`}
              >
                transition wallet
              </button>
            ) : null}
          </div>
        ) : (
          <div className=" flex flex-col gap-2 mt-2  w-full">
            <button
              onClick={() => toggleModal("bereavementFundInfoModal", bf)}
              className={`gap-2 pl-5  hover:bg-white rounded-[5px] flex items-center`}
            >
              see info
            </button>
            <button
              onClick={() =>
                toggleModal("requestToJoinBfModal", { bf, state: 1 })
              }
              className={`gap-2 pl-5  hover:bg-white rounded-[5px] flex items-center`}
            >
              request to join
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BereavementFund;
