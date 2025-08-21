"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useState } from "react";
import GroupDetails from "./sections/GroupDetails";
import GroupName from "./sections/GroupName";
import MoreGroupDetails from "./sections/MoreGroupDetails";
import { NewInputGroupType } from "@/types/groups";
import { useMutation } from "@tanstack/react-query";
import {
  createGroup,
  uploadGroupIconCover,
  uploadGroupIconImage,
} from "@/api/group";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user";
import { useAppDispatch } from "@/lib/hooks";
import { fetchGroupList } from "@/lib/features/groups/groupSlice";

const NewGroupModal = () => {
  const { modals, toggleModal } = useSettingModal();
  const { currentUser } = useUser({});

  const dispatch = useAppDispatch();

  const [step, setStep] = useState(1);
  const [values, setValues] = useState<NewInputGroupType>({
    name: `${currentUser?.profile.firstName}'s group`.toLocaleLowerCase() || "",
    tags: [],
    type: "",
    privacy: "PUBLIC",
    description: "",
    currency: "UGX",
    iconImage: undefined,
  });

  const router = useRouter();
  const newGroupModal = modals.newGroupModal;

  const next = () => {
    setStep((prev) => prev + 1);
  };

  const back = () => {
    setStep((prev) => prev - 1);
  };

  const create = async () => {
    try {
      const { privacy, ...rest } = values;

      let coverUrl: string = "";
      let iconUrl: string = "";

      if (values.coverImage) {
        const res = await uploadGroupIconCover(values.coverImage);

        if (res.data.url) coverUrl = res.data.url || "";
      }
      if (values.iconImage) {
        const res = await uploadGroupIconImage(values.iconImage);

        if (res.data.url) iconUrl = res.data.url || "";
      }

      delete rest.coverImage;
      delete rest.iconImage;

      const response = await createGroup({
        ...rest,
        iconUrl: iconUrl || "",
        coverUrl: coverUrl || "",
        status: privacy,
      });

      await dispatch(fetchGroupList());
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onError: (error: any) => {
      console.log(error);
      toast.error(error.message);
    },
    onSuccess: async (data) => {
      if (data?.groupId) {
        router.push(`/groups/${data?.groupId}/${data?.generalChannelId}`);

        toast.success(data?.message);
        console.log(data, "data");

        handleToggleModal();
      } else {
        toast.error("Something went wrong, please try again..");
      }
    },
  });
  const handleToggleModal = () => {
    toggleModal("newGroupModal");
    setStep(1);
    setValues({
      name:
        `${currentUser?.profile.firstName}'s group`.toLocaleLowerCase() || "",
      tags: [],
      type: "",
      privacy: "",
      description: "",
      currency: "UGX",
    });
  };

  return (
    <>
      <div
        className={` ${
          newGroupModal ? " max-tablet-lg:hidden flex" : "hidden"
        } fixed left-0 w-full  right-0 top-0 bottom-0 items-center justify-center z-30`}
      >
        <button
          onClick={() => handleToggleModal()}
          disabled={isPending}
          className={`w-full  z-0 fixed items-center justify-center h-full bg-black bg-opacity-[75%] ${
            newGroupModal ? "flex" : "hidden"
          }`}
        />

        <div className="bg-white z-20  duration-500 transition-all relative w-[440px]  font-inter rounded-lg rounded-bl-none  overflow-hidden shadow-lg ">
          {step === 1 && (
            <GroupName
              setValues={(key, value) => {
                setValues((prev) => ({
                  ...prev,
                  [key]: value,
                }));
              }}
              values={values}
              next={next}
              handleToggleModal={handleToggleModal}
            />
          )}
          {step === 2 && (
            <GroupDetails
              handleToggleModal={handleToggleModal}
              back={back}
              setValues={(key, value) => {
                setValues((prev) => ({
                  ...prev,
                  [key]: value,
                }));
              }}
              values={values}
              next={next}
            />
          )}

          {step === 3 && (
            <MoreGroupDetails
              handleToggleModal={handleToggleModal}
              back={back}
              setValues={(key, value) => {
                setValues((prev) => ({
                  ...prev,
                  [key]: value,
                }));
              }}
              values={values}
              create={() => mutate()}
              isLoading={isPending}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default NewGroupModal;
