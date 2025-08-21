import CustomDialog from "@/components/custom/CustomDialog";
import AuthButton from "@/components/button/AuthButton";

interface LeaveGroupModalProps {
  isOpen: boolean;
  toggleModal: (modalName: string, value: any) => void;
  isPending: boolean;
  mutateLeaveGroup: () => void;
}

const Exit: React.FC<LeaveGroupModalProps> = ({
  isOpen,
  toggleModal,
  isPending,
  mutateLeaveGroup,
}) => {
  return (
    <CustomDialog
      open={isOpen}
      close={() => {}}
      name="leaveGroupModal"
      contentClassName="sm:max-w-[525px] py-10 z-[55] bg-white"
    >
      <div className="text-center">
        <h4 className="text-xl font-semibold">Are you sure?</h4>
        <p className="text-[14px] mt-2">
          Leaving the group will mean you have no access to its information and
          the Benevolent Fund
        </p>
      </div>
      <div className="mt-4 items-center grid grid-cols-2 gap-4">
        <AuthButton
          text="No, Cancel"
          className=" text-[14px] h-auto py-3"
          handleClick={() => toggleModal("leaveGroupModal", null)}
          loaderH={24}
          loaderW={24}
        />
        <AuthButton
          text="Yes, Leave"
          isLoading={isPending}
          handleClick={mutateLeaveGroup}
          className={`bg-red-600 text-white text-[14px] h-auto py-3`}
          loaderH={24}
          loaderW={24}
        />
      </div>
    </CustomDialog>
  );
};

export default Exit;
