'use client';

import * as React from 'react';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export function InputOTPControlled({
  value = '',
  setValue = () => {}
}: {
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="space-y-2">
      <InputOTP maxLength={5} value={value} onChange={(value: string) => setValue(value)}>
        <InputOTPGroup className=" flex gap-4   rounded-none ">
          <InputOTPSlot index={0} className="  h-[50px]  w-[50px]  bg-divider-100 rounded-l-none   rounded-r-none border-divider" />
          <InputOTPSlot index={1} className=" h-[50px]  w-[50px]  bg-divider-100 rounded-l-none border   rounded-r-none border-divider" />
          <InputOTPSlot index={2} className=" h-[50px]  w-[50px]  bg-divider-100  rounded-l-none border  rounded-r-none border-divider" />
          <InputOTPSlot index={3} className=" h-[50px]  w-[50px]  bg-divider-100 rounded-l-none  border  rounded-r-none border-divider" />
          <InputOTPSlot index={4} className=" h-[50px]  w-[50px]  bg-divider-100 rounded-l-none   border rounded-r-none border-divider" />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
