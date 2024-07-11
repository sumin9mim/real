'use client';

import BaseLayout from '@/components/BaseLayout';
import auth from '@/net/auth';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Mypage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  });
  return (
    <>
      <BaseLayout>
        <div className='flex justify-center'>
          <div className='w-full max-w-md mx-auto mt-12 p-6 bg-white rounded shadow-md'>
            <h1 className='text-2xl font-bold mb-6 text-center'>마이 페이지</h1>
            <label className='block mb-1'>이메일 주소: {user?.email}</label>
            <div className='mb-4'>코인: </div>
            <div className='flex justify-center'>
              <button
                className='w-full font-bold bg-green-500 hover:bg-green-600 text-white py-2 rounded'
                onClick={() => router.push('/changepassword')}
              >
                비밀번호 변경
              </button>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  );
}
