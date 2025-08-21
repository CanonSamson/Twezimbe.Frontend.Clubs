'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import GroupHeaderLoader from './group/loading';
import FriendLoader from './friends/loading';

const GroupHeader = dynamic(() => import('./group'), {
  ssr: false,
  loading: () => <GroupHeaderLoader />
});

const ChatHeader = dynamic(() => import('./chats'), { ssr: false });

const FriendsHeader = dynamic(() => import('./friends'), {
  ssr: false,
  loading: () => <FriendLoader />
});

const Header = () => {
  const pathname = usePathname() || '';

  if (pathname === '/chats') return null;
  if (pathname.includes(`/join/`) || pathname === '/group/') return null;

  return (
    <div className="w-full prevent-select ">
      {/* <div className="w-full h-[100px] border-b-[1px]  flex-none mobile:px-[50px] px-[20px] prevent-select "> */}
      {pathname.includes('/group/') || pathname === '/group' ? (
        <GroupHeader />
      ) : pathname.includes('/chats/') || pathname === '/chats' ? (
        <ChatHeader />
      ) : pathname === '/friends' ? (
        <FriendsHeader />
      ) : null}
    </div>
  );
};

export default Header;
