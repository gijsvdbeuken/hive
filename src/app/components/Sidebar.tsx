'use client';
import React from 'react';
import Image from 'next/image';
import logo from '../../../public/logo-full-white-multicolor.png';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      {expanded ? (
        <aside className="w-[300px] bg-white bg-opacity-5 p-4 text-white">
          <Image src={logo} alt="Logo" className="w-[125px]" />
          <div className="my-2 h-[1.5px] w-full rounded-full bg-white bg-opacity-10"></div>
          <div className="flex items-center gap-2">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-black">GB</div>
            <h2>Gijs van den Beuken</h2>
          </div>
          <div className="my-2 h-[1.5px] w-full rounded-full bg-white bg-opacity-10"></div>
          <nav>
            <ul>
              <li className={pathname === '/' ? 'flex items-center rounded-md bg-white bg-opacity-5 py-2' : 'flex items-center py-2 text-white text-opacity-50'}>
                <div className="flex w-[40px] justify-center">
                  <i className="fa-regular fa-message"></i>
                </div>
                <Link href="/" className="block rounded py-1 hover:bg-gray-700">
                  Chat
                </Link>
              </li>
              <li className={pathname === '/hives' ? 'flex items-center rounded-md bg-white bg-opacity-5 py-2' : 'flex items-center py-2 text-white text-opacity-50'}>
                <div className="flex w-[40px] justify-center">
                  <i className="fa-solid fa-hexagon-nodes"></i>
                </div>
                <Link href="/hives" className="block rounded py-1 hover:bg-gray-700">
                  Manage Hives
                </Link>
              </li>
              <li className={pathname === '/settings' ? 'flex items-center rounded-md bg-white bg-opacity-5 py-2' : 'flex items-center py-2 text-white text-opacity-50'}>
                <div className="flex w-[40px] justify-center">
                  <i className="fa-solid fa-sliders"></i>
                </div>
                <Link href="/settings" className="block rounded py-1 hover:bg-gray-700">
                  Manage Settings
                </Link>
              </li>
            </ul>
          </nav>
          <div className="my-2 h-[1.5px] w-full rounded-full bg-white bg-opacity-10"></div>
          <div className="flex flex-col gap-2">
            <div className="border-1 rounded-md border-[1.5px] border-white border-opacity-10 p-2 text-white text-opacity-50">
              <p className="text-white text-opacity-50">Dummy converstion</p>
              <small>Created on 11 of March, 10:34</small>
            </div>
            <div className="border-1 rounded-md border-[1.5px] border-white border-opacity-10 p-2 text-white text-opacity-50">
              <p className="text-white text-opacity-50">Dummy converstion</p>
              <small>Created on 11 of March, 10:34</small>
            </div>
            <div className="border-1 rounded-md border-[1.5px] border-white border-opacity-10 p-2 text-white text-opacity-50">
              <p className="text-white text-opacity-50">Dummy converstion</p>
              <small>Created on 11 of March, 10:34</small>
            </div>
            <div className="border-1 rounded-md border-[1.5px] border-white border-opacity-10 p-2 text-white text-opacity-50">
              <p className="text-white text-opacity-50">Dummy converstion</p>
              <small>Created on 11 of March, 10:34</small>
            </div>
            <div className="border-1 rounded-md border-[1.5px] border-white border-opacity-10 p-2 text-white text-opacity-50">
              <p className="text-white text-opacity-50">Dummy converstion</p>
              <small>Created on 11 of March, 10:34</small>
            </div>
          </div>
        </aside>
      ) : (
        ''
      )}

      <button onClick={() => (expanded ? setExpanded(false) : setExpanded(true))} className="h-[40px] w-[40px]">
        {expanded ? <i className="fa-solid fa-chevron-left"></i> : <i className="fa-solid fa-chevron-right"></i>}
      </button>
    </>
  );
};

export default Sidebar;
