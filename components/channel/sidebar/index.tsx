import { useSettingModal } from '@/contexts/modal-setting';

// components/Sidebar.js
export default function Sidebar() {
  const { modals } = useSettingModal();

  return (
    <div className={`${modals.groupSider ? 'w-20 ' : ' w-0'} duration-500 transition-transform`}>
      <div className="h-screen  flex flex-col items-center p-4    duration-500 transition-transform"></div>
    </div>
  );
}
