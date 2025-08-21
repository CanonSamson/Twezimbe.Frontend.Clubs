'use client'

import { Card } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { formatAmount } from '@/utils/functions/formatAmount'
import { Skeleton } from '@/components/ui/skeleton'
import moment from 'moment'
import { useSettingModal } from '@/contexts/modal-setting'
import { toast } from 'sonner'
import { OneTimeMembershipResponse } from '@/api/bereavement-fund/membership'

const TableHeads = [
  { id: 1, label: 'Item' },
  { id: 2, label: 'Amount' },
  { id: 3, label: 'Status' },
  { id: 4, label: 'Payment Date' },
  { id: 6, label: 'Actions' }
]
const MembershipTable = ({ data, isLoading }: { data?: OneTimeMembershipResponse["data"], isLoading: boolean }) => {
  const { toggleModal } = useSettingModal()


  return (
    <div className=''>
      <h2 className='hidden tablet-lg:block text-xl font-semibold text-gray-900'>
        Membership
      </h2>
      <p className='hidden tablet-lg:block text-gray-600 mt-1'>
        This one off payment qualifies you to become part of the fund.{' '}
        <a
          href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/learn-more/my-payments`}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 hover:underline'
        >
          Learn more
        </a>
      </p>

      {/* Desktop */}
      <Card className='mt-6  bg-white tablet-lg:block hidden'>
        <Table>
          <TableHeader className='bg-gray-50'>
            <TableRow>
              {TableHeads.map(head => (
                <TableCell key={head.id}>
                  <TableHead>{head.label}</TableHead>
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                {TableHeads.map(head => (
                  <TableCell key={head.id}>
                    <Skeleton className='h-4 w-full' />
                  </TableCell>
                ))}
              </TableRow>
            ) : (
              <TableRow>
                <TableCell className=' p-2  text-gray-400'>
                  {data?.data.name}
                </TableCell>
                <TableCell className=' p-2  text-gray-400'>
                  UGX {formatAmount(String(data?.data.membershipFee || 0))}
                </TableCell>
                <TableCell
                  className={`font-medium p-2  ${
                    data?.data.status === 'PAID'
                      ? 'text-green-600'
                      : data?.data.status === 'PENDING'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {data?.data.status}
                </TableCell>
                <TableCell className=' p-2  text-gray-400'>
                  {data?.data.paymentDate
                    ? moment(data.data.paymentDate).format('DD/MM/YYYY')
                    : '-'}
                </TableCell>
                <TableCell>
                  {data?.data.status === 'PAID' ? (
                    <Button
                      onClick={() => {
                        toast.info('You have already paid for this membership. No action available at the moment.')
                      }}
                      variant='outline'
                      size='sm'
                      className='opacity-50'
                    >
                      ...
                    </Button>
                  ) : (
                    <Button
                      variant='outline'
                      size='lg'
                      className='opacity-50 mt-1 py-2 px-4 !text-[16px] font-medium shadow-sm transition duration-200'
                      onClick={() => {
                        toggleModal('payBfMembershipModal', {
                          data: data?.data
                        })
                      }}
                    >
                      Pay
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/*  tablet-lg  */}
      <Card className='mt-6 rounded-md  bg-white tablet-lg:hidden flex flex-col px-4 py-4 gap-4'>
        <h2 className='text-xl font-semibold text-gray-900'>Membership</h2>
        <p className='text-gray-600 mt-1'>
          This one off payment qualifies you to become part of the fund.{' '}
          <a
            href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/learn-more/my-payments`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
          >
            Learn more
          </a>
        </p>
        {isLoading ? (
          TableHeads.map(head => (
            <div
              key={head.id}
              className='flex justify-between items-center  pb-2'
            >
              <span className='text-sm font-medium text-gray-500'>
                {head.label}
              </span>
              <Skeleton className='h-4 w-1/2' />
            </div>
          ))
        ) : (
          <>
            <div className='flex justify-between items-center pb-2'>
              <span className='text-sm font-medium text-black'>Item</span>
              <span className='text-gray-400'>{data?.data.name}</span>
            </div>
            <div className='flex justify-between items-center  pb-2'>
              <span className='text-sm font-medium text-black'>Amount</span>
              <span className='text-gray-400'>
                UGX {formatAmount(String(data?.data.membershipFee || 0))}
              </span>
            </div>
            <div className='flex justify-between items-center  pb-2'>
              <span className='text-sm font-medium text-black'>Status</span>
              <span
                className={`font-medium ${
                  data?.data.status === 'PAID'
                    ? 'text-green-600'
                    : data?.data.status === 'PENDING'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {data?.data.status}
              </span>
            </div>
            <div className='flex justify-between items-center  pb-2'>
              <span className='text-sm font-medium text-black'>
                Payment Date
              </span>
              <span className='text-gray-400'>
                {data?.data.paymentDate
                  ? moment(data.data.paymentDate).format('DD/MM/YYYY')
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center  pb-2'>
              <span className='text-sm font-medium text-black'>Next Due</span>
              <span className='text-gray-400'>-</span>
            </div>
            <div className='flex justify-between items-center pt-2'>
              <span className='text-sm font-medium text-black'>Actions</span>
              {data?.data.status === 'PAID' ? (
                <Button variant='outline' size='sm' className='opacity-50'>
                  ...
                </Button>
              ) : (
                <Button
                  variant='outline'
                  size='lg'
                  className='opacity-50 px-6 py-2 text-sm font-bold shadow-sm transition duration-200 rounded-full'
                  onClick={() => {
                    toggleModal('payBfMembershipModal', {
                      data: data?.data
                    })
                  }}
                >
                  Pay
                </Button>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default MembershipTable
