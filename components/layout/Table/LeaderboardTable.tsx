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
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

const leaderboardData: {
  id: number
  name: string
  amount: string
  ranking: number
}[] = []

// const leaderboardData : {
//   id: number;
//   name: string;
//   amount: string;
//   ranking: number;
// }[]= [
//   { id: 1, name: 'James Mark', amount: 'UGX 500', ranking: 1 },
//   { id: 2, name: 'Winner Beatrice', amount: 'UGX 250', ranking: 2 }
// ]

const LoadingRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton className='h-4 w-[150px]' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-[100px]' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-[80px]' />
    </TableCell>
  </TableRow>
)

const LeaderboardTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboardData,
    enabled: true
  })

  return (
    <Card className='p-6 mt-6 rounded-none bg-white'>
      <h2 className='text-xl font-bold text-[#101828] mb-4'>Leaderboard</h2>
      <Table>
        <TableHeader className='bg-gray-50'>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Total Amount Contributed</TableHead>
            <TableHead>Ranking</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <>
              <LoadingRow />
              <LoadingRow />
              <LoadingRow />
            </>
          ) : !data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className='text-center py-4'>
                <div className='flex flex-col items-center justify-center'>
                  <p className='text-sm text-muted-foreground'>
                    No leaderboard entries found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map(entry => (
              <TableRow key={entry.id}>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.amount}</TableCell>
                <TableCell>{entry.ranking}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}

export default LeaderboardTable
