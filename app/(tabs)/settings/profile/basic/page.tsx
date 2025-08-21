import PublicProfileSettingsForm from "@/sections/profile/settings-form/PublicProfileSettingsForm";

const GeneralProfileSettings = () => {
  return (
    <div className=" tablet-lg:px-10 pb-10">
      <h4 className="text-[22px] font-semibold max-tablet:hidden">
        Public Profile
      </h4>

      <PublicProfileSettingsForm />
    </div>
  );
};

export default GeneralProfileSettings;
