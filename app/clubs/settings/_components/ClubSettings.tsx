'use client'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { IoIosArrowRoundBack } from 'react-icons/io'

export default function ClubSettingsLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const clubId = useParams()?.clubId as string
  const groupId = useParams()?.groupId as string
  const pathName = usePathname()
  const router = useRouter()

  const handleBack = () => {
    router.replace(`/clubs/${clubId}`)
  }

  type Navigation = {
    name: string
    route: string
    permission: {
      resource: string
      action: string
      data?: any
    }
  }
  const navigations: Navigation[] = [
    {
      name: 'Setup Wizard',
      route: `/clubs/settings/${groupId}/${clubId}`,
      permission: {
        resource: 'setupWizard',
        action: 'view',
        data: { clubId }
      }
    },
    {
      name: 'Club Profile',
      route: `/clubs/settings/${clubId}/${groupId}/profile`,
      permission: {
        resource: 'clubProfile',
        action: 'view',
        data: { clubId }
      }
    },
    {
      name: 'Membership & KYC Rules',
      route: `/clubs/settings/${clubId}/${groupId}/membership-kyc`,
      permission: {
        resource: 'membershipKyc',
        action: 'view',
        data: { clubId }
      }
    },
    {
      name: 'Manage Invitations',
      route: `/clubs/settings/${clubId}/${groupId}/invitations`,
      permission: {
        resource: 'invitations',
        action: 'view',
        data: { clubId }
      }
    },
    {
      name: 'Officer Roles',
      route: `/clubs/settings/${clubId}/${groupId}/officer-roles`,
      permission: {
        resource: 'officerRoles',
        action: 'view',
        data: { clubId }
      }
    }
  ]

  return (
    <div className='min-h-screen font-inter h-screen w-full flex flex-col bg-[#F2F2F2] tablet-lg:bg-transparent'>
      <div className='relative tablet-lg:hidden mt-14 tablet:mt-1 bg-[#F2F2F2] '>
        <button
          onClick={handleBack}
          className='absolute left-2 top-1/2 transform -translate-y-1/2'
        >
          <IoIosArrowRoundBack size={40} />
        </button>
        <h1 className='w-full uppercase text-center font-inter text-[20px]'>
          Club Settings
        </h1>
      </div>

      {/* Main Layout */}
      <div className='flex w-full h-full relative'>
        {/* Sidebar */}
        <div className='hidden md:flex md:relative w-[250px] flex-col bg-primary/75'>
          <div className='flex flex-col h-full'>
            <>
              {/* Sidebar Title */}
              <div className='mt-6 items-center text-start uppercase w-full text-white px-2'>
                <span className='text-[14px]'>CLUB ADMIN SETTINGS</span>
              </div>

              {/* Member Navigation Links */}
              <div className='flex mt-4 flex-col gap-2 font-medium overflow-y-auto px-2'>
                {navigations.map((navigation, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(navigation.route)}
                    className={`flex items-center px-3 py-2 text-start rounded-[5px] w-full 
                      ${
                        pathName === navigation.route
                          ? 'bg-[#C3DBEC] text-primary'
                          : 'text-white hover:bg-white/10'
                      }`}
                  >
                    <span className='truncate'>{navigation.name}</span>
                  </button>
                ))}
              </div>
            </>
          </div>
        </div>

        {/* Main Content */}
        <div className='bg-white w-full relative max-tablet:h-[100dvh] overflow-y-auto'>
          {/* Mobile Navigation Tabs - Filtered */}
          <div className='block sticky z-[50] top-0 md:hidden w-full bg-[#F2F2F2] py-3'>
            <div className='overflow-x-auto'>
              <div className='flex gap-2 px-4 min-w-max'>
                {navigations.map((navigation, index) => {
                  const isActive = pathName === navigation.route
                  return (
                    <button
                      key={index}
                      onClick={() => router.push(navigation.route)}
                      className={`px-4 py-2 rounded-[10px] border text-sm whitespace-nowrap
                          ${
                            isActive
                              ? 'bg-[#0072C6] text-white'
                              : 'bg-white text-[#4A4A4A] border-[#E5E7EB] hover:bg-gray-50'
                          }`}
                    >
                      {navigation.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
