import CustomDialog from '@/components/custom/CustomDialog';
import AuthButton from '@/components/button/AuthButton';
import CustomBfCurrencyInput from '@/components/input/CustomBfCurrencyInput';
import CustomSelect from '@/components/input/CustomSelect';
import CustomTextInput from '@/components/input/CustomTextInput';
import { useFormik } from 'formik';
import { WithdrawalMethodOptions } from '@/utils/data/withdrawal';

interface BfLeaveGroupModalProps {
  isOpen: boolean;
  toggleModal: (modalName: string, value: any) => void;
}

const Withdrawal: React.FC<BfLeaveGroupModalProps> = ({ isOpen, toggleModal }) => {
  const formik = useFormik({
    initialValues: {
      withdrawal: '',
      withdrawalMethod: '',
      phoneNumber: '',
      bankName: '',
      accountDetails: '',
      accountName: '',
    },
    onSubmit: () => {
      toggleModal('bfLeaveGroupModal', null);
    },
  });

  return (
    <CustomDialog
      open={isOpen}
      close={() => {}}
      name="bfLeaveGroupModal"
      contentClassName="sm:max-w-[525px] py-10 z-[55] bg-white custom-modal overflow-visible"
    >
      <div className="text-center">
        <h4 className="text-xl font-semibold">Withdrawal process</h4>
        <p className="text-[13px] mt-2 text-[#969696]">
          Withdrawals take up to 1 - 3 business days
        </p>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-2">
            <h1 className="text-[15.94px] font-bold text-left">Withdrawal Amount</h1>
            <CustomBfCurrencyInput
              type="text"
              id="withdrawal"
              className="text-[12px] text-[#797979] font-inter"
              inputClassName="bg-divider-100"
              value={formik.values.withdrawal}
              onChange={formik.handleChange}
              placeholder="4,750"
            />
          </div>

          <div className="mt-6">
            <div className="space-y-2">
              <h1 className="text-[15.94px] font-bold text-left">Method</h1>
              <CustomSelect
                selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
                options={WithdrawalMethodOptions}
                placeholder="Choose your withdrawal method"
                className="text-[12px] text-[#797979] font-inter"
                value={formik.values.withdrawalMethod}
                onChange={(value) => formik.setFieldValue('withdrawalMethod', value)}
              />
            </div>
          </div>

          {formik.values.withdrawalMethod === 'mobile money' && (
            <div className="mt-6">
              <div className="space-y-2">
                <h1 className="text-[15.94px] font-bold text-left">Phone Number</h1>
                <CustomTextInput
                  type="tel"
                  id="phoneNumber"
                  inputClassName="bg-divider-100"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  placeholder="009955234"
                />
              </div>
            </div>
          )}

          {formik.values.withdrawalMethod === 'bank' && (
            <div className="mt-6">
              <div className="space-y-2">
                <h1 className="text-[15.94px] font-bold text-left">Bank Name</h1>
                <CustomTextInput
                  type="text"
                  id="bankName"
                  inputClassName="bg-divider-100"
                  value={formik.values.bankName}
                  onChange={formik.handleChange}
                  placeholder="Citibank Uganda"
                />

                <h1 className="text-[15.94px] font-bold text-left">Account Details</h1>
                <CustomTextInput
                  type="text"
                  id="accountDetails"
                  inputClassName="bg-divider-100"
                  value={formik.values.accountDetails}
                  onChange={formik.handleChange}
                  placeholder="8122894599"
                />

                <h1 className="text-[15.94px] font-bold text-left">Account Name</h1>
                <CustomTextInput
                  type="text"
                  id="accountName"
                  inputClassName="bg-divider-100"
                  value={formik.values.accountName}
                  onChange={formik.handleChange}
                  placeholder="James mark"
                />
              </div>
            </div>
          )}

          <div className="mt-4 items-center gap-4">
            <AuthButton
              text="Request Withdrawal"
              type="submit"
            />
          </div>
        </form>
      </div>
    </CustomDialog>
  );
};

export default Withdrawal;