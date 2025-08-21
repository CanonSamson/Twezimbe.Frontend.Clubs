import NextOfKinSettingsForm from "@/sections/kyc/settings-form/NextOfKinSettingsForm";

const NextOfKin = () => {
  return (
    <div className=" tablet:px-10 pb-10">
      <h4 className=" text-[22px]  font-semibold tablet:mt-0 mt-[-20px]">Next of kin details</h4>

      <NextOfKinSettingsForm />
    </div>
  );
};

export default NextOfKin;
