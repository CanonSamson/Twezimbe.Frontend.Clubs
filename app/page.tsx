'use client';
// project import
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/home');
  }, []);

  return <Loader />;
}
