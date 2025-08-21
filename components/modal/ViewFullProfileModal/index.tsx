'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { FiMoreHorizontal } from 'react-icons/fi'
import { MessageCircle, X } from 'lucide-react'
import { useSettingModal } from '@/contexts/modal-setting'
import CustomAvatar from '@/components/custom/CustomAvatar'
import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '@/api/user'
import { HiOutlineUserPlus } from 'react-icons/hi2'
import { socialIcons } from '@/utils/data/socialIcons'

const sections = [
  { name: 'about', title: 'About Me', path: 'about' },
  { name: 'mutualGroups', title: 'Mutual Groups', path: 'mutualGroups' }
]

const ViewFullProfileModal = () => {
  const { toggleModal, closeModal, modalData, modals } = useSettingModal()
  const pathName = usePathname()
  const [activeRoute, setActiveRoute] = useState(
    ['about', 'mutualGroups'].includes(pathName) ? pathName : 'about'
  )

  const user = modalData.viewFullProfileModal

  const router = useRouter()
  const { data } = useQuery({
    queryKey: ['userProfile', user?.id], // Added meaningful query key
    queryFn: () =>
      getUserProfile(user?.id, {
        with_mutual_guilds: true
      }), // Pass the same ID for self-profile
    enabled: !!user?.id && !!modals?.viewFullProfileModal
  })

  // Filter socials that are NOT empty or null
  const validSocials = useMemo(() => {
    return socialIcons.filter(icon => {
      const key = icon.key
      const value = data?.data.user?.socials?.[key]
      return value && value !== ''
    })
  }, [socialIcons, data?.data.user?.socials])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center ${
        modals?.viewFullProfileModal ? 'flex' : 'hidden'
      }`}
    >
      <div
        className='absolute inset-0 bg-black opacity-50'
        onClick={() => toggleModal('viewFullProfileModal')}
      />

      <div className='z-[101] flex w-full max-w-lg items-center justify-center max-tablet:fixed max-tablet:inset-x-0 max-tablet:bottom-0 max-tablet:top-auto max-tablet:h-[min(70vh,100%)] max-tablet:max-w-full'>
        <div className='flex w-full flex-col max-tablet:rounded-t-[10px] max-tablet:h-[70vh] max-tablet:overflow-y-auto'>
          <div className='relative mt-6 flex flex-col rounded-[10px] bg-[#F9F9F9] tablet-lg:bg-white max-tablet:rounded-b-none'>
            <div className='relative flex h-[100px] justify-end rounded-[10px] bg-gradient-to-r bg-[#F9F6F7] p-6 max-tablet:rounded-b-none max-tablet:bg-[#D9D9D9]'>
              <div className='absolute left-1/2 top-4 hidden -translate-x-1/2 max-tablet:block'>
                <Image
                  src='/icon/bar.svg'
                  alt='gray-bar'
                  width={50}
                  height={50}
                  className='mb-4 self-center'
                />
              </div>

              <div className='flex items-center gap-2'>
                <button className='rounded-full border bg-white p-1'>
                  <FiMoreHorizontal className='size-[20px] text-black' />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    toggleModal('viewFullProfileModal')
                  }}
                  className='rounded-full border bg-white p-1 max-tablet:hidden'
                >
                  <X className='size-[20px] text-black' />
                </button>
              </div>
            </div>

            <div className='p-6'>
              <div className='flex flex-col items-start justify-between md:flex-row'>
                <div className='flex items-center gap-4 -mt-16'>
                  <div className='flex flex-col'>
                    <CustomAvatar
                      image={user?.profileImage}
                      className='justify-start'
                      imageClassName='h-[64px] w-[64px] overflow-hidden rounded-[10px] border object-top text-[32px] font-bold text-primary'
                      labelClassName='flex h-[64px] w-[64px] items-center justify-center overflow-hidden rounded-[10px]'
                      alt='profile image'
                      showText={false}
                      disabled={true}
                      iconClassName='size-[28px]'
                      isCurrentUser={false}
                      userFullName={`${user?.firstName} ${user?.lastName}`}
                    />
                    <div className='mt-2 flex w-full items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-[18px] font-medium'>
                          {user?.firstName} {user?.lastName}
                        </span>
                        {user?.firstName && user?.lastName && (
                          <span className='h-1.5 w-1.5 rounded-full bg-green-500' />
                        )}
                      </div>

                      <div className='absolute right-4 top-[120px] flex items-center gap-2 tablet:hidden'>
                        <button className='rounded-[4px] text-[12px]'>
                          <MessageCircle
                            style={{ transform: 'rotate(270deg)' }}
                            className='rounded size-[24px]  border border-black p-1.5'
                          />
                        </button>
                        <button className='flex items-center gap-1.5 rounded-[4px] bg-primary px-2 py-1 text-[10px] text-white'>
                          <HiOutlineUserPlus className=' size-[24px] tablet:size-10' />
                        </button>
                      </div>
                    </div>
                    <span className='opacity-50 text-sm'>
                      @{user?.userName}
                    </span>
                  </div>
                </div>

                <div className='mt-3 hidden items-center gap-2 tablet:flex md:mt-0'>
                  <button
                    onClick={() => {
                      closeModal('viewFullProfileModal')
                      router.push(`/dms/${user?.id}`)
                    }}
                    className='flex items-center gap-1.5 rounded-[4px] bg-primary px-4 py-2 text-[14px] text-white'
                  >
                    <MessageCircle
                      style={{ transform: 'rotate(270deg)' }}
                      className='rounded size-4 bp-2'
                    />
                    Message
                  </button>
                </div>
              </div>

              <div className='mt-6 space-y-4 rounded-[8px] bg-[#F9F6F7] p-6 max-tablet:bg-white'>
                <div className='tablet:hidden'>
                  <h1 className='relative left-2 top-3 text-[14px] font-bold'>
                    About Me
                  </h1>
                </div>

                <nav className='hidden pt-3 tablet:block'>
                  <ul className='flex flex-wrap justify-start'>
                    {sections.map(route => (
                      <li key={route.name}>
                        <button
                          className={`border-b-2 px-4 py-1.5 text-[14px] font-bold transition-all duration-300 ${
                            activeRoute === route.path
                              ? 'border-primary'
                              : 'border-gray-200'
                          }`}
                          onClick={() => setActiveRoute(route.path)}
                        >
                          {route.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

                {activeRoute === 'about' && (
                  <div className='flex flex-wrap justify-start'>
                    <div className='pb-8 pl-4'>
                      <h1 className='relative right-2 mb-4 text-left text-[13px]  font-light font-inter tablet:right-0'>
                        {data?.data?.user?.bio}
                      </h1>
                      <h2 className='relative  text-[#808080] right-2 text-left text-[13px] font-semibold tablet-lg:right-0'>
                        Member since
                      </h2>
                      <p className='relative right-2 text-left text-[13px] tablet-lg:right-0'>
                        2025
                      </p>
                      {validSocials.length > 0 ? (
                        <>
                          <h2 className='relative mt-4 text-[#808080] right-2 text-left text-[13px] font-semibold tablet-lg:right-0'>
                            Socials
                          </h2>
                          <div className='relative right-2 flex space-x-3 tablet-lg:right-0'>
                            {validSocials?.map((icon, index) => (
                              <Image
                                key={index}
                                src={icon.src}
                                alt={icon.alt}
                                width={20}
                                height={20}
                                className='h-auto w-[20px]'
                              />
                            ))}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                )}

                {activeRoute === 'mutualGroups' && (
                  <div className='flex flex-col  mt-4'>
                    {data?.data?.user?.groups?.map((group, index) => {
                      return (
                        <button
                          key={index}
                          className='flex items-center gap-2 '
                          onClick={() => {
                            router.push(`/groups/${group?.id}`)
                          }}
                        >
                          <CustomAvatar
                            image={user?.profileImage}
                            className='justify-start'
                            imageClassName='h-[20px] w-[20px] overflow-hidden rounded-full border object-top text-[32px] font-bold text-primary'
                            labelClassName='flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-full'
                            alt='profile image'
                            showText={false}
                            disabled={true}
                            iconClassName='size-[28px]'
                            isCurrentUser={false}
                            userFullName={`${group?.name}`}
                          />
                          <p className='text-[12px]'>{group?.name}</p>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className='mt-6 space-y-3 rounded-[8px] bg-[#FFFFFF] p-6 tablet:mt-0 tablet:space-y-0 tablet:rounded-none tablet:bg-transparent tablet:p-0 max-tablet:block tablet-lg:hidden'>
                <div className='flex flex-col items-start gap-3 tablet:flex-row tablet:items-center'>
                  <div className='flex flex-row flex-wrap items-center gap-3'>
                    <div className='flex items-center gap-3'>
                      <div className='flex flex-col space-y-1'>
                        <h2 className='text-[13px] font-semibold tablet:hidden'>
                          Mutual groups
                        </h2>

                        {data?.data?.user?.groups?.map((group, index) => {
                          return (
                            <button
                              key={index}
                              className='flex items-center gap-2  '
                              onClick={() => {
                                router.push(`/groups/${group?.id}`)
                              }}
                            >
                              <CustomAvatar
                                image={user?.profileImage}
                                className='justify-start'
                                imageClassName='h-[20px] w-[20px] overflow-hidden rounded-full border object-top text-[32px] font-bold text-primary'
                                labelClassName='flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-full'
                                alt='profile image'
                                showText={false}
                                disabled={true}
                                iconClassName='size-[28px]'
                                isCurrentUser={false}
                                userFullName={`${group?.name}`}
                              />
                              <p className='text-[12px]  '>{group?.name}</p>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewFullProfileModal
