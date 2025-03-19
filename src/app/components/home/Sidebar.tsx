'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '../../../../public/logo-full-white-multicolor.png';
import History from '../sidebar/History';
import Navigation from '../sidebar/Navigation';
import Account from '../sidebar/Account';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="relative">
      {expanded && (
        <aside className="fixed left-0 top-0 h-screen w-[300px] bg-white bg-opacity-5 p-4 text-white">
          <Image src={logo} alt="Logo" className="w-[125px]" />
          <Account />
          <Navigation />
          <History />
        </aside>
      )}
      <button onClick={() => setExpanded(!expanded)} className={`fixed top-[10px] z-50 h-[40px] w-[40px] rounded-md bg-white bg-opacity-10 text-white transition-all ${expanded ? 'left-[310px]' : 'left-[10px]'}`}>
        <i className={`fa-solid ${expanded ? 'fa-chevron-left' : 'fa-chevron-right'}`} />
      </button>
    </div>
  );
};

export default Sidebar;
