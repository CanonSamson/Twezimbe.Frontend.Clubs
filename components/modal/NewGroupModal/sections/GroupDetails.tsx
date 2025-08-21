"use client"

import CustomSelect from '@/components/input/CustomSelect';
import CustomTextInput from '@/components/input/CustomTextInput';
import { useSettingModal } from '@/contexts/modal-setting';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { toast } from 'sonner';
import { NewInputGroupType } from '@/types/groups';
import { currencyOptions, groupPrivacyOptions, groupTypeOptions } from '@/utils/data/group';

const GroupDetails: React.FC<{
  setValues: (key: string, value: string | string[]) => void;
  next: () => void;
  back: () => void;
  handleToggleModal: () => void;
  values: NewInputGroupType;
}> = ({ setValues, next, back, handleToggleModal, values }) => {


  const [tagQuery, setTagQuery] = useState('');
  const [tags, setTags] = useState<string[]>(values.tags || []);
  const { modals } = useSettingModal();

  const handleAddTag = () => {
    if (tagQuery.trim() && !tags.includes(tagQuery.trim())) {
      setTags((prev) => [...prev, tagQuery.trim()]);
      setTagQuery(''); // Clear the input
    } else {
      toast.error('Tag already added or empty!');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleNext = () => {
    setValues('tags', tags);
    next();
  };

  useEffect(() => {
    if (!modals.newGroupModal) {
      setTagQuery('');
      setTags([]);
    }
  }, [modals.newGroupModal]);

  return (
    <>
      <div className=" max-h-[70vh] w-full overflow-x-auto">
        <div className="p-6">
          <div className="flex justify-end items-center mb-4">
            <button className="text-divider-200 hover:text-divider-300 duration-500 transition-colors" onClick={() => handleToggleModal()}>
              <IoClose size={34} />
            </button>
          </div>
          <div className="text-center mt-5">
            <h2 className="text-xl font-bold">Tell us more about your group</h2>
            <p className="text-[14px] text-divider-200 mb-6">Please provide more information to enable us to set up properly</p>
          </div>

          <div className="flex flex-col gap-4">
            <CustomSelect
              selectTriggerClassName="bg-divider-100"
              label="Group Type"
              options={groupTypeOptions}
              placeholder="Select group type"
              value={values.type}
              optionPlaceHolder="Type"
              onChange={(type) => {
                setValues('type', type);
              }}
            />
            <CustomSelect
              selectTriggerClassName="bg-divider-100"
              label="Privacy"
              options={groupPrivacyOptions}
              placeholder="Select group privacy"
              value={values.privacy}
              optionPlaceHolder="Privacy"
              onChange={(privacy) => {
                setValues('privacy', privacy);
              }}
            />
            <div>
              <label htmlFor="groupTags" className="block text-sm font-medium text-gray-700 mb-2"></label>

              <CustomTextInput
                type="text"
                id="group name"
                onChange={(e) => setTagQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                value={tagQuery}
                label=" Group Tags"
                placeholder="Enter a tag and press Enter"
                className="mt-4 "
                inputClassName="bg-divider-100"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button key={tag} className="inline-flex items-center px-3 py-1 bg-divider-100 text-divider-300  text-sm rounded-[5px]">
                    {tag}
                    <button className="ml-2 text-sm" onClick={() => handleRemoveTag(tag)}>
                      <IoClose size={16} />
                    </button>
                  </button>
                ))}
              </div>
            </div>
             <CustomSelect
              selectTriggerClassName='bg-divider-100'
              label='Currency'
              options={currencyOptions}
              placeholder='Select currency'
              value={values.currency}
              optionPlaceHolder='Currency'
              onChange={currency => {
                setValues('currency', currency)
              }}
            />
          </div>
        </div>
        <div className="flex bg-primary justify-between bottom-0 sticky p-3">
          <button className="px-4 py-2 text-gray-200 rounded-md" onClick={() => back()}>
            Back
          </button>
          <button className="px-4 py-2 text-primary bg-white rounded-md" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default GroupDetails;
