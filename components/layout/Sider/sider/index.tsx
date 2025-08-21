import React from 'react'
import ListComponent from '../components/index'
import { useAppSelector } from '@/lib/hooks'
import { useSettingModal } from '@/contexts/modal-setting'

// Define the props type
interface SiderListProps {
  pathname: string
  siderWidth?: number
}

const SiderList: React.FC<SiderListProps> = ({ pathname, siderWidth = 80 }) => {
  const { groupList } = useAppSelector(state => state.group)
  const { toggleModal } = useSettingModal()

  return (
    <>
      <ul className='tablet-lg:text-[#D4D4D4] text-md mt-[10px] tablet-lg:h-full overflow-auto'>
        <ListComponent
          _name='Home'
          _icon='/icon/home.svg'
          _clickedIcon='/icon/home_blue.svg'
          _url='/home'
          pathname={pathname}
          siderWidth={siderWidth}
        />
        <ListComponent
          _name='Groups'
          _icon='/icon/community.svg'
          _clickedIcon='/icon/community_blue.svg'
          _url='/groups'
          pathname={pathname}
          siderWidth={siderWidth}
          groupList={groupList}
        />
        <ListComponent
          _name='Direct'
          _icon='/icon/chats.svg'
          _clickedIcon='/icon/chats_blue.svg'
          _url='/dms'
          pathname={pathname}
          siderWidth={siderWidth}
        />
        <ListComponent
          _name='Savings'
          _icon='/icon/savings-icon.svg'
          _clickedIcon='/icon/community_blue.svg'
          _url='/savings'
          pathname={pathname}
          siderWidth={siderWidth}
          handleClick={() => {
            toggleModal("savingsWaitListModal");
          }}
        />
        <ListComponent
          _name='Wallet'
          _icon='/icon/wallet.svg'
          _clickedIcon='/icon/community_blue.svg'
          _url='/global-wallet'
          pathname={pathname}
          siderWidth={siderWidth}
          // handleClick={() => {
          //   toggleModal("comingSoonModal");
          // }}
        />
        <ListComponent
          _name='Club'
          _icon='/icon/club.svg'
          _clickedIcon='/icon/community_blue.svg'
          _url='/cubs'
          pathname={pathname}
          siderWidth={siderWidth}
          handleClick={() => {
                  toggleModal("clubsWaitListModal");

          }}
        />
        <ListComponent
          _name='Crowd Fund'
          _icon='/icon/crowd-fund.svg'
          _clickedIcon='/icon/community_blue.svg'
          _url='/crowd-fund'
          pathname={pathname}
          siderWidth={siderWidth}
          handleClick={() => {
           toggleModal("crowdsWaitListModal");
          }}
        />
      </ul>
    </>
  )
}


export default SiderList
