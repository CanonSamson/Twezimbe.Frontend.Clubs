import EducationEmploymentSettingsForm from "@/sections/kyc/settings-form/EducationEmploymentSettingsForm";

const EducationEmployment = () => {
  return (
    <div className=" tablet:px-10 pb-10">
        <h4 className=" text-[22px]  font-semibold tablet:mt-0 mt-[-20px]">Education and employment details</h4>
        <EducationEmploymentSettingsForm  />
    </div>
  );
};

export default EducationEmployment;
