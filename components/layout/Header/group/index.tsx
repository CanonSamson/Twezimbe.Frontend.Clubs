'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

const GroupHeader = () => {
  const pathname = usePathname();

  if (pathname.includes(`/join/`)) return;
  return (
    <>
      <div className={`w-full flex  mt-[40px] justify-between items-start`}></div>
    </>
  );
};
export default GroupHeader;
