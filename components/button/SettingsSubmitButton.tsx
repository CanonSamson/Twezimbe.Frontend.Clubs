import { useSettingModal } from '@/contexts/modal-setting'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const SettingsSubmitButton = ({ disabled = false, loading = false }: { loading?: boolean, disabled?: boolean }) => {
  const { toggleModal } = useSettingModal()
  return (
    <button
    disabled={disabled || loading}
    type="submit"
    className="border-divider px-5 py-3 flex items-center gap-2 border rounded duration-500 transition-all max-tablet:text-white max-tablet:bg-primary max-tablet:rounded-md max-tablet:font-inter"
    onClick={() => toggleModal('kycSubmitModal')}
  >
    Save Changes{' '}
    {loading && (
      <AiOutlineLoading3Quarters
        size={20}
        className="animate-spin duration-500 transition-all"
      />
    )}
  </button>
  )
}

export default SettingsSubmitButton
