"use client";

import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import { useReauthOnboardingQuery } from '@/lib/store/api';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export default function ReAuth() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  const router = useRouter();

  if(restaurantId === null) {
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
    return (
      <div className='flex flex-col justify-center align-middle place-items-center min-h-screen'>
        <h1>Error: restaurantId is null</h1>
      </div>
    )
  }
  const { data } = useReauthOnboardingQuery({restaurantId});

  console.log(data);

  return (
    <div className='flex flex-col justify-center align-middle place-items-center min-h-screen'>
      {
        !data ?
        (
          <>
            <h1>Generating link to complete onboarding...</h1>
            <Loader size='lg'/>
          </>
        )
        :
        (
          <Button>
            <Link href={data.stripeOnboardingUrl} target='_blank'>Completa tu onboarding</Link>
          </Button>
        )
      }
      <Button className='bg-blue-500 mt-4'>
        <Link href={`/dashboard`}>Volver a dashboard</Link>
      </Button>
    </div>
  )
}
