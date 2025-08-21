'use client';
import React, { useState, useEffect } from 'react';

const GroupHeader = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  console.log(windowWidth)
  
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setWindowWidth(windowWidth);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial margin calculation

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <div className={`w-full flex  mt-[40px] justify-between`}></div>
    </>
  );
};
export default GroupHeader;
