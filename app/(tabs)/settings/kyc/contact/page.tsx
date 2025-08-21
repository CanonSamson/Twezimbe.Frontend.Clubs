import ContactSettingsForm from "@/sections/kyc/settings-form/ContactSettingsForm";

const Contact = () => {
  return (
    <div className=" tablet:px-10 pb-10">
      <h4 className=" text-[22px]  font-semibold ">
        Contact details (extended)
      </h4>
      <ContactSettingsForm />
    </div>
  );
};

export default Contact;
