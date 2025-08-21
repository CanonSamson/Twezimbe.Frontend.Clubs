import * as React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink
} from '@/components/ui/pagination'

interface PaginationProps {
  currentPage: number
  pageSize: number
  handleNextPage: () => void
  handlePrevPage: () => void
  data: any
  className?: string
}

const PaginationPage: React.FC<PaginationProps> = ({
  currentPage,
  handleNextPage,
  handlePrevPage,
  data,
  className
}) => {
  if (!data) {
    return null
  }

  return (
    <Pagination className={`mb-10 ${className} m-0`}>
      <PaginationContent className=' duration-300 transition-all '>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={handlePrevPage}
            className='border border-gray-300 rounded-md hover:bg-gray-50'
            aria-label='Previous page'
          >
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </PaginationPrevious>
        </PaginationItem>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              href='#'
              className='border border-gray-300 rounded-md hover:bg-gray-50'
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            href='#'
            className='border border-primary text-primary rounded-md hover:bg-gray-50'
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href='#'
            className='border border-gray-300 rounded-md hover:bg-gray-50'
          >
            {currentPage + 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href='#'
            onClick={handleNextPage}
            className='border border-gray-300 rounded-md hover:bg-gray-50'
            aria-label='Next page'
          >
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationPage
