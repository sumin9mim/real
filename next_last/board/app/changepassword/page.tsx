// Import necessary modules and types
'use client';

import BaseLayout from '@/components/BaseLayout';
import auth from '@/net/auth';
import {
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Import necessary modules and types

// Import necessary modules and types

// Import necessary modules and types

export default function Changepassword() {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async () => {
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    const user = auth.currentUser;

    if (user) {
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );

      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        alert('비밀번호가 성공적으로 변경되었습니다.');
        router.push('/');
      } catch (error) {
        setError(
          '비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해 주세요.'
        );
      }
    } else {
      setError('사용자 인증에 실패했습니다.');
    }
  };

  return (
    <BaseLayout>
      <div className='flex justify-center'>
        <div className='w-full max-w-md mx-auto mt-12 p-6 bg-white rounded shadow-md'>
          <h1 className='text-2xl font-bold mb-6 text-center'>비밀번호 변경</h1>

          {error && <div className='text-red-500 text-sm mb-4'>{error}</div>}

          <div className='mb-4'>
            <input
              type='password'
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className='border border-solid border-gray-300 w-full p-2 rounded'
              placeholder='현재 비밀번호'
            />
          </div>

          <div className='mb-4'>
            <input
              type='password'
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className='border border-solid border-gray-300 w-full p-2 rounded'
              placeholder='새 비밀번호'
            />
          </div>

          <div className='mb-4'>
            <input
              type='password'
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className='border border-solid border-gray-300 w-full p-2 rounded'
              placeholder='새 비밀번호 확인'
            />
          </div>

          <div>
            <button
              className='w-full font-bold bg-blue-500 hover:bg-blue-600 text-white py-2 rounded'
              onClick={submit}
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
