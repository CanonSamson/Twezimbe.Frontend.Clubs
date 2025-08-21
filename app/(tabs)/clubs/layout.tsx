import dynamic from 'next/dynamic'
import React from 'react'

const ClubCreatedModal = dynamic(
  () => import('@/components/modal/club/ClubCreatedModal')
)
export default function ClubLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ClubCreatedModal />
    </>
  )
}
