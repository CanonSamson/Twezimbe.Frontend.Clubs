"use client"
import CustomTextInput from '@/components/input/CustomTextInput';
import { IoClose } from 'react-icons/io5';
import { toast } from 'sonner';
import { NewInputGroupType } from '@/types/groups';

const GroupName: React.FC<{
  setValues: (key: string, value: string | string[]) => void;
  next: () => void;
  handleToggleModal: () => void;
  values: NewInputGroupType;
}> = ({ setValues, next, handleToggleModal, values }) => {
  const handleNext = () => {
    if (values.name.trim() && values.name.length < 50) {
      next();
    } else {
      if (!values.name.trim()) {
        toast.error('Group name cannot be empty.');
      } else if (values.name.length >= 50) {
        toast.error('Group name must be less than 50 characters.');
      }
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-end items-center mb-4">
          <button className="text-divider-200 hover:text-divider-300 duration-500 transition-colors" onClick={() => handleToggleModal()}>
            <IoClose size={34} />
          </button>
        </div>
        <div className=" text-center mt-5">
          <h2 className="text-xl font-bold">Create Your Group</h2>

          <p className="text-[14px] text-divider-200 mb-6">Groups are how you build communities and achieve together</p>
        </div>

        <CustomTextInput
          type="text"
          id="group name"
          onChange={(e) => setValues('name', e.target.value)}
          value={values.name}
          label="Group Name"
          placeholder="Enter group name"
          className=" py-4 "
          inputClassName="bg-divider-100"
        />
      </div>
      <div className="flex bg-primary justify-end p-3">
        <button className="px-4 py-2  text-primary bg-white rounded-md " onClick={() => handleNext()}>
          Next
        </button>
      </div>
    </>
  );
};

export default GroupName;
