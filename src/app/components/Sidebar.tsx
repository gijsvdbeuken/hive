'use client';
import React from 'react';
import Image from 'next/image';
import logo from '../../../public/logo-full-white-multicolor.png';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white bg-opacity-5 p-4 text-white">
      <Image src={logo} alt="Logo" className="w-[150px]" />
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
    </aside>
  );
};

export default Sidebar;
