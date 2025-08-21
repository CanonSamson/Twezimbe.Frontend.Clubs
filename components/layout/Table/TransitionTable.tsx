'use client'

import React, { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import CustomAvatar from '@/components/custom/CustomAvatar'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { CiSearch } from 'react-icons/ci'
import Image from 'next/image'
import { IoChevronDown } from 'react-icons/io5'
import { useQuery } from '@tanstack/react-query'
import { getTransitionMember } from '@/api/bereavement-fund/transition'
import { useParams } from 'next/navigation'
import { formatAmount } from '@/utils/functions/formatAmount'
import { useSettingModal } from '@/contexts/modal-setting'

const TableHeads = [
  { id: 'member', name: 'Member' },
  { id: 'balanceSource', name: 'Balance Source' },
  { id: 'amount', name: 'Amount' },
  { id: 'status', name: 'Status' },
  { id: 'remark', name: 'Remark' },
  { id: 'actions', name: 'Actions' }
]

const ITEMS_PER_PAGE = 5

const LoadingRow = () => (
  <TableRow className='border-b'>
    {TableHeads.map((_, index) => (
      <TableCell key={index} className='py-4'>
        <Skeleton className='h-4 w-full' />
      </TableCell>
    ))}
  </TableRow>
)

const LoadingCard = () => (
  <div className='border border-gray-400 rounded-md p-4 mb-4'>
    <div className='flex items-center gap-3 pb-3 border-b border-gray-400'>
      <Skeleton className='w-12 h-12 rounded-full' />
      <Skeleton className='h-4 w-32' />
    </div>
    <div className='flex justify-between py-2'>
      <span>Amount</span>
      <Skeleton className='h-4 w-24' />
    </div>
    <div className='flex justify-between py-2'>
      <span>Status</span>
      <Skeleton className='h-4 w-20' />
    </div>
    <Skeleton className='w-full h-10 mt-3' />
  </div>
)

const TransitionTable = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  })
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const { openModal } = useSettingModal()

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search)
    }, 500)

    return () => clearTimeout(timer)
  }, [filters.search])
  const itemsMap: Record<string, string[]> = {
    status: ['Accepted', 'Declined', 'Pending']
  }

  const bfId = useParams()?.bfId as string

  const { data, isLoading } = useQuery({
    queryKey: [
      'getTransitionMember',
      bfId,
      currentPage,
      debouncedSearch,
      filters.status
    ],
    queryFn: () =>
      getTransitionMember(bfId, {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch || undefined,
        status: filters.status || undefined
      })
  })

  const members = data?.data?.data?.members || []
  const pagination = data?.data?.data?.pagination || {
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: ITEMS_PER_PAGE,
    totalCount: 0,
    totalPages: 0
  }

  const totalPages = pagination.totalPages
  const startIdx = (pagination.currentPage - 1) * pagination.limit
  const endIdx = Math.min(startIdx + pagination.limit, pagination.totalCount)
  const currentMembers = members // Use all members from API response since pagination is handled server-side

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className='bg-white rounded-lg shadow-sm p-0 mx-8 mt-2'>
      <div className='flex flex-col tablet-lg:flex-row items-center gap-4 bg-gray-50 -mx-0.5 px-2 py-2 rounded-md'>
        <div className='flex items-center bg-gray-200 px-3 py-1 w-full tablet-lg:w-52 rounded-md'>
          <CiSearch className='text-xl text-gray-800' />
          <input
            type='text'
            placeholder='Search members...'
            value={filters.search}
            onChange={e => {
              setFilters(prev => ({ ...prev, search: e.target.value }))
              setCurrentPage(1) // Reset to first page when searching
            }}
            className='ml-2 w-full bg-gray-200 outline-none text-sm text-gray-700'
          />
        </div>

        {[['status', 'Status']].map(([key, label]) => (
          <DropdownMenu key={key}>
            <DropdownMenuTrigger asChild>
              <div className='flex items-center gap-1 bg-white px-3 py-1 rounded-md border border-gray-300 cursor-pointer w-full tablet-lg:w-auto'>
                <Image
                  alt={key}
                  src={`/icon/${key}.svg`}
                  width={20}
                  height={20}
                  className='w-auto h-[20px]'
                />
                <span className='text-sm text-gray-700'>
                  {filters.status || label}
                </span>
                <IoChevronDown className='text-gray-700' />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align='start'
              sideOffset={4}
              className='w-44 bg-white border border-gray-200 shadow-lg p-3'
            >
              <DropdownMenuItem
                onSelect={() => {
                  setFilters(prev => ({ ...prev, status: '' }))
                  setCurrentPage(1)
                }}
                className='text-sm'
              >
                All Statuses
              </DropdownMenuItem>
              {itemsMap[key].map(item => (
                <DropdownMenuItem
                  key={item}
                  onSelect={() => {
                    setFilters(prev => ({
                      ...prev,
                      status: item.toUpperCase()
                    }))
                    setCurrentPage(1) // Reset to first page when filtering
                  }}
                  className='text-sm'
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}

        {/* Reset filters button */}
        {(filters.search || filters.status) && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setFilters({ search: '', status: '' })
              setCurrentPage(1)
            }}
            className='text-sm border-gray-300 text-gray-600 w-full tablet-lg:w-auto'
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* Show active filters indicator */}
      {(debouncedSearch || filters.status) && (
        <div className='flex flex-wrap items-center gap-2 mb-4 px-2'>
          <span className='text-sm text-gray-600'>Active filters:</span>
          {debouncedSearch && (
            <span className='bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs'>
              Search: &quot;{debouncedSearch}&quot;
            </span>
          )}
          {filters.status && (
            <span className='bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs'>
              Status: {filters.status}
            </span>
          )}
        </div>
      )}

      <div className='block tablet-lg:hidden'>
        {isLoading ? (
          [...Array(3)].map((_, index) => <LoadingCard key={index} />)
        ) : currentMembers.length === 0 ? (
          <div className='text-center py-6 text-gray-500'>
            No transitions found
          </div>
        ) : (
          currentMembers.map(member => (
            <div
              key={member.id}
              className='border border-gray-200 rounded-md p-4 mb-4'
            >
              <div className='flex items-center gap-3 pb-3 border-gray-200'>
                <CustomAvatar
                  image={member?.user?.profileImage}
                  className='justify-start w-[50px] h-[50px]'
                  imageClassName='h-[50px] object-top text-[30px] font-bold text-primary border w-[50px] rounded-[12px] overflow-hidden flex items-center justify-center'
                  labelClassName='h-[50px] w-[50px] rounded-[9px] overflow-hidden flex items-center justify-center'
                  alt='profile image'
                  showText={false}
                  disabled={true}
                  iconClassName='w-[30px] h-[30px]'
                  isCurrentUser={false}
                  userFullName={`${member?.user?.firstName} ${member?.user?.lastName}`}
                />
                <span className='text-gray-800 font-medium'>
                  {member?.user?.firstName} {member?.user?.lastName}
                </span>
              </div>

              <div className='flex justify-between py-2'>
                <span className='text-gray-600'>Amount</span>
                <span className='text-gray-800 font-medium'>
                  UGX {formatAmount(String(member.amount || 0))}
                </span>
              </div>

              <div className='flex justify-between py-2'>
                <span className='text-gray-600'>Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    member?.status === 'APPROVED' ||
                    member?.status === 'ACCEPTED'
                      ? 'bg-green-100 text-green-700'
                      : member?.status === 'DECLINED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {member?.status}
                </span>
              </div>

              <Button
                variant='outline'
                className='w-full mt-3 rounded-md py-1 text-sm border-gray-300 text-gray-600'
              >
                View
              </Button>
            </div>
          ))
        )}
      </div>

      <Table className='hidden tablet-lg:table'>
        <TableHeader className='bg-gray-50'>
          <TableRow>
            {TableHeads.map(head => (
              <TableHead
                key={head.id}
                className={`text-left font-medium text-gray-700 py-3 ${
                  head.id === 'actions' ? 'text-right' : ''
                }`}
              >
                {head.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(3)].map((_, index) => <LoadingRow key={index} />)
          ) : currentMembers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={TableHeads.length}
                className='text-center py-6 text-gray-500'
              >
                No transitions found
              </TableCell>
            </TableRow>
          ) : (
            currentMembers.map(member => (
              <TableRow key={member.id} className='hover:bg-gray-50'>
                <TableCell className='py-3'>
                  <div className='flex items-center gap-3'>
                    <CustomAvatar
                      image={member?.user?.profileImage}
                      className='justify-start w-[50px] h-[50px]'
                      imageClassName='h-[50px] object-top text-[30px] font-bold text-primary border w-[50px] rounded-[12px] overflow-hidden flex items-center justify-center'
                      labelClassName='h-[50px] w-[50px] rounded-[9px] overflow-hidden flex items-center justify-center'
                      alt='profile image'
                      showText={false}
                      disabled={true}
                      iconClassName='w-[30px] h-[30px]'
                      isCurrentUser={false}
                      userFullName={`${member?.user?.firstName} ${member?.user?.lastName}`}
                    />
                    <span className='text-gray-800 font-medium'>
                      {member?.user?.firstName} {member?.user?.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='py-3 text-gray-600'>
                  UGX {formatAmount(String(member.amount || 0))}
                </TableCell>
                <TableCell className='py-3 text-gray-700'>
                  UGX {formatAmount(String(member.amount || 0))}
                </TableCell>

                <TableCell className='py-3 text-gray-600'>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      member?.status === 'APPROVED' ||
                      member?.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-700'
                        : member?.status === 'DECLINED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {member?.status}
                  </span>
                </TableCell>
                <TableCell className='py-3  text-gray-700'>
                  {member?.paymentStatus || 'N/A'}
                </TableCell>

                <TableCell className='py-3 text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='outline'
                        className='rounded-md py-1 text-sm border-gray-300 text-gray-600'
                      >
                        View
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align='end'
                      className='w-40 bg-white border border-gray-200 shadow-lg'
                    >
                      {member?.paymentStutus === 'UNPAID' ? (
                        <DropdownMenuItem
                          onClick={() => {
                            openModal('deleteTransitionMemberModal', {
                              member
                            })
                          }}
                          className='text-red-600'
                        >
                          Delete
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className='flex justify-end items-center mt-6 px-2 gap-6'>
        <p className='text-sm text-gray-500'>
          Showing {startIdx + 1}-{endIdx} of {pagination.totalCount}
        </p>

        <div className='flex items-center gap-2'>
          <button
            className='p-1 border rounded-md'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <IoIosArrowBack />
          </button>

          {Array.from({ length: totalPages }, (_, idx) => {
            const page = idx + 1
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 text-sm rounded-md border ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                {page}
              </button>
            )
          })}

          <button
            className='p-1 border rounded-md'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransitionTable
