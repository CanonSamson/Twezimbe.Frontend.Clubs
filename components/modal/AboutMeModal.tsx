"use client";
import CustomDialog from "../custom/CustomDialog";
import { useMemo, useState } from "react";
import AuthButton from "../button/AuthButton";
import CustomTextarea from "../input/CustomTextarea";
import { useUser } from "@/contexts/user";
import CustomAvatar from "../custom/CustomAvatar";
import { uploadUserProfile } from "@/api/upload/user-profile";
import { toast } from "sonner";
import { updateBasicUserInfo } from "@/api/basic-profile";
import Link from "next/link";
import { skippedBio } from "@/api/user-settings";

const AboutMeModal = () => {
  const { currentUser, fetchCurrentUser } = useUser({});
  const [uploading, setUploading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileUrl, setProfileUrl] = useState<undefined | string>(undefined);
  const [bio, setBio] = useState("");
  const [closed, setClosed] = useState(false);

  const noBio = useMemo(() => {
    if (closed) return false;
    const hasBio =
      currentUser?.profile?.bio !== null && currentUser?.profile?.bio !== "";
    const hasSkippedBio = currentUser?.settings?.skippedBio === true;

    return !hasBio && !hasSkippedBio;
  }, [currentUser?.settings?.skippedBio, currentUser?.profile?.bio, closed]);

  const handleSkippedBio = async () => {
    try {
      setClosed(true);
      await skippedBio();
      await fetchCurrentUser({ load: false });
    } catch {}
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const response = await uploadUserProfile(file);
      if (response.data) {
        setProfileUrl(response.data.url);
      }
      return response;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (bio.length > 500) {
        toast.error("Bio should not exceed 500 characters");
        return;
      }

      setIsUpdating(true);
      const response = await updateBasicUserInfo({
        profileImage: profileUrl,
        bio: bio.trim(),
      });

      if (response?.data?.success) {
        toast.success("User Profile Information Updated Successfully");
        fetchCurrentUser({ load: false });
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    noBio && (
      <CustomDialog
        open={noBio}
        close={handleSkippedBio}
        name="aboutMeModalModal"
        contentClassName=" z-[55]  text-center py-5 tablet:py-10 tablet:min-w-[600px] font-inter bg-white"
      >
        <div>
          <div className=" flex items-center w-full gap-4">
            <CustomAvatar
              image={profileUrl || undefined}
              className="justify-start"
              labelClassName="h-[100px] w-[100px] rounded-[5px]  border-solid "
              imageClassName={` rounded-[5px] `}
              alt="Upload"
              showText={true}
              disabled={false}
              iconClassName="size-[44px]"
              onFileChange={(file: File) => {
                toast.promise(handleImageUpload(file), {
                  loading: "Uploading...",
                  success: "Uploaded successfully",
                  error: "Upload failed",
                });
              }}
            />
            <div className=" text-start">
              <div className=" items-center gap-1 flex ">
                <h4 className=" text-xl  font-semibold">
                  {currentUser?.profile.firstName}{" "}
                  {currentUser?.profile.lastName}
                </h4>
                <span className="  h-[10px] w-[10px] rounded-full bg-green-600 flex " />
              </div>
              <p>@{currentUser?.profile.userName}</p>

              <Link
                href={`/settings/profile/basic`}
                className=" text-[14px] mt-2 text-primary font-semibold"
              >
                Edit Profile
              </Link>
            </div>
          </div>
          <div className="  mt-10  ">
            <CustomTextarea
              id="bio"
              value={bio}
              label="About me"
              placeholder="Write something brief about yourself"
              className="mt-4 "
              textareaClassName="bg-divider-100 text-start w-full"
              onChange={(e) => setBio(e.target.value)}
            />
            <AuthButton
              isLoading={isUpdating}
              disabled={isUpdating || uploading}
              handleClick={handleUpdateProfile}
              text="Save"
              className=" mt-5"
            />
          </div>
        </div>
      </CustomDialog>
    )
  );
};

export default AboutMeModal;
