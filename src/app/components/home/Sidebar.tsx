'use client';
import React from 'react';
import Image from 'next/image';
import logo from '../../../../public/logo-full-white-multicolor.png';
import { useState } from 'react';
import History from '../sidebar/History';
import Navigation from '../sidebar/Navigation';
import Account from '../sidebar/Account';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-row items-center justify-center">
      {expanded ? (
        <aside className="h-full w-[300px] bg-white bg-opacity-5 p-4 text-white">
          <Image src={logo} alt="Logo" className="w-[125px]" />
          <Account />
          <Navigation />
          <History />
        </aside>
      ) : (
        ''
      )}
      <button onClick={() => (expanded ? setExpanded(false) : setExpanded(true))} className="h-[40px] w-[40px]">
        {expanded ? <i className="fa-solid fa-chevron-left"></i> : <i className="fa-solid fa-chevron-right"></i>}
      </button>
    </div>
  );
};

export default Sidebar;
