import DocumentsSettingsForm from "@/sections/kyc/settings-form/DocumentsSettingsForm";

const Documents = () => {
  return (
    <div className=" max-tablet-lg:pt-5 tablet-lg:px-10 pb-10">
      <h4 className=" text-[22px]  font-semibold tablet:mt-0 mt-[-20px]">
        Upload documents
      </h4>
      <p>Upload documents to help us identify you</p>

      <DocumentsSettingsForm />
    </div>
  );
};

export default Documents;
