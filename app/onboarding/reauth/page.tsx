"use client";

import { useSearchParams } from 'next/navigation';
import React from 'react'

export default function ReAuth() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');

  return (
    <div>Re-auth</div>
  )
}
