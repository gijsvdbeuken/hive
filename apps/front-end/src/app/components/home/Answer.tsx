import React from 'react';
import Image from 'next/image';
import logo from '../../../../public/logo-beeldmerk-white.png';

const Answer = ({ answer }: { answer: string }) => {
  return (
    <div className="flex w-full flex-row items-center">
      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-orange-500">
        <Image src={logo} alt="Logo" className="w-[125px]" />
      </div>
      <div className="rounded-md px-3 py-5">{answer}</div>
    </div>
  );
};

export default Answer;
