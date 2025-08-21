import CustomDialog from "@/components/custom/CustomDialog";
import AuthButton from "@/components/button/AuthButton";
import { useSettingModal } from "@/contexts/modal-setting";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useFormik } from "formik";
import CustomTextInput from "../input/CustomTextInput";
import * as yup from "yup";
import { GroupType } from "@/types/groups";
import { useMutation } from "@tanstack/react-query";
import { deleteGroup } from "@/api/group";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DeleteGroup = ({ group }: { group: GroupType }) => {
  const { modalData, updateModalData, closeModal } = useSettingModal();

  const data = modalData?.deleteGroupModal;

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteGroup(group.id),
    onSuccess: (data) => {
      toast.success("Group deleted successfully.");
      router.replace("/home");
      console.log(data);
      closeModal("deleteGroupModal");
    },
    onError: (error) => {
      toast.error(
        "Failed to delete group: " + error?.message || JSON.stringify(error)
      );
      console.error(error);
    },
  });

  const { values, handleSubmit, errors, isValid, setFieldValue, touched } =
    useFormik({
      initialValues: { groupName: "" },
      validationSchema: yup.object({
        groupName: yup
          .string()
          .required("Group name is required")
          .test("match", "Group name must match exactly", function (value) {
            return value === group.name;
          }),
      }),
      onSubmit: (values) => {
        console.log("Deleting group:", values.groupName);
        mutate();
      },
    });

  return (
    <CustomDialog
      close={() => {}}
      name="deleteGroupModal"
      contentClassName="max-w-[450px] py-10 z-[55] bg-white custom-modal"
    >
      {data?.state === "confirm" ? (
        <>
          <div className="flex flex-col items-center text-center p-0">
            <h4 className="self-start text-left text-[20px] font-semibold mb-4 font-inter">
              Confirm action
            </h4>
            <p className="self-start text-left text-[12px] font-roboto">
              You are about to delete{" "}
              <span className="font-bold text-[15px]"> {group?.name}. </span>{" "}
              Please enter the group name below to confirm this action
            </p>

            <CustomTextInput
              type="text"
              id="groupName"
              value={values.groupName}
              onChange={(e) => setFieldValue("groupName", e.target.value)}
              error={touched.groupName && errors.groupName}
              placeholder={group.name}
              inputClassName="bg-gray-100"
              className="mt-4 w-full"
            />

            <div className="self-end text-right mt-4 flex items-center gap-4">
              <AuthButton
                text="Cancel"
                handleClick={() => closeModal("deleteGroupModal")}
                className="rounded-md border border-gray-400 px-3 py-0.5 text-primary bg-white text-[13px] h-11"
              />
              <AuthButton
                text="Delete Group"
                className={`bg-[#FF0000] disabled:opacity-50 duration-300  transition-all text-white rounded-md px-3 py-0.5 text-[13px] h-11 whitespace-nowrap`}
                disabled={!isValid}
                isLoading={isPending}
                handleClick={() => handleSubmit()}
              />
            </div>
          </div>
        </>
      ) : !!data?.hasBf ? (
        <>
          <div className="flex flex-col items-center text-center p-0">
            <div className="mb-4 w-[200px] h-[200px] bg-[#C3DBEC] rounded-full flex items-center justify-center">
              <Image
                src="/icon/cloud.svg"
                alt="cloud"
                width={150}
                height={150}
                className=" h-[150px] w-auto"
              />
            </div>

            <h4 className="text-xl font-semibold mb-2">
              Oops! Hold on a second.
            </h4>

            <p className="text-[13px] font-inter">
              Deletion is not permitted for groups with active Bereavement
              Funds. Please contact Twezimbe Support to request formal closure
              in compliance with Data Protection and Financial Regulations.
            </p>

            <div className="mt-6 w-full">
              <AuthButton
                text="Close"
                handleClick={() => closeModal("deleteGroupModal")}
                className="w-full rounded-md bg-[#1170B2]"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center text-center p-0">
            <h4 className="self-start text-left text-xl font-semibold mb-4">
              Delete {group?.name}?
            </h4>
            <p className="self-start text-left text-[13px] font-inter">
              You are about to permanently delete this group. All group data
              will be erased, and this action cannot be undone. Members will be
              notified to first exit and recover their data. Are you sure you
              want to proceed?
            </p>

            <div className="self-end text-right mt-4 items-center grid grid-cols-2 gap-4">
              <AuthButton
                text="Cancel"
                handleClick={() => {
                  closeModal("deleteGroupModal");
                }}
                className="rounded-md border border-gray-400 px-3 py-0.5 text-primary bg-white text-[13px] h-11"
              />
              <AuthButton
                text="Proceed"
                className="bg-[#FF0000] text-white rounded-md px-3 py-0.5 text-[13px] h-11 whitespace-nowrap"
                handleClick={() => {
                  updateModalData("deleteGroupModal", {
                    ...data,
                    state: "confirm",
                  });
                }}
              />
            </div>
          </div>
        </>
      )}
    </CustomDialog>
  );
};

const DeleteGroupModal = () => {
  const group = useAppSelector((state: RootState) => state.group.group);

  if (!group?.name) return null;
  return <DeleteGroup group={group} />;
};

export default DeleteGroupModal;
