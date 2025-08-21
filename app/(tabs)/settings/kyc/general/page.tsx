import BasicInfoSettingsForm from "@/sections/kyc/settings-form/BasicInfoSettingsForm";

const GeneralProfileSettings = () => {
  return (
    <div className=" max-tablet-lg:pt-5 tablet-lg:px-10 pb-10">
      <h4 className="text-[22px] font-semibold tablet:mt-0 mt-[-20px]">
        Basic info
      </h4>
      <BasicInfoSettingsForm />
    </div>
  );
};

export default GeneralProfileSettings;
