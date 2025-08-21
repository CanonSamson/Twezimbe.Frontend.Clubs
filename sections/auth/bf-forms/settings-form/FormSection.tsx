import React from 'react';

const FormSection = ({ children, heading, className }: { children: React.ReactNode; heading?: string , className?: string}) => {
  return (
    <div className={`border rounded-[10px] p-4 tablet:p-10 ${className}`}>
      <h4 className=" text-[20px] font-semibold">{heading}</h4>
      <div>{children}</div>
    </div>
  );
};

export default FormSection;
