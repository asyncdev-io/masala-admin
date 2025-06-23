'use client'

import { Calendar } from '@/components/ui/calendar'
import Loader from '@/components/ui/loader';
import { UserNav } from '@/components/user-nav'
import { useGetPendingPaymentsQuery } from '@/lib/store/api';
import React, { useState } from 'react'
import { DateRange } from 'react-day-picker';

export default function page() {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const shouldSkipQuery = !selectedRange?.from || !selectedRange?.to;
  const { data, isLoading } = useGetPendingPaymentsQuery({
    startDate: selectedRange?.from?.toISOString().split('T')[0] || '',
    endDate: selectedRange?.to?.toISOString().split('T')[0] || '',
    restaurantId: ''
  }, {
    skip: shouldSkipQuery
  });

  return (
    <div className='flex-1'>
      <header className='flex h-14 items-center justify-end gap-4 border-b bg-white px-6'>
        <UserNav />
      </header>

      <main className='flex flex-col place-items-center justify-center mt-8'>
        {/* Date picker */}
        <div>
          <Calendar
            mode="range"
            selected={selectedRange} // Pass the current selected range state
            onSelect={setSelectedRange} // Update the state when a new range is selected
            numberOfMonths={2} // Show two months side-by-side for easier range selection
          />
        </div>
        {/* Show pending payments */}
        <table className='w-4/5 border-collapse'>
          <thead>
            <tr>
              <th className='border-b border-r border-gray-300 p-2 text-left'>Restaurant name</th>
              <th className='border-b border-gray-300 p-2 text-left'>Amount</th>
            </tr>
          </thead>
          <tbody>
            {
              isLoading && (
                <tr className='bg-white'>
                  <td colSpan={2} className='border-r border-gray-300 p-2 text-center'>
                    <Loader />
                  </td>
                </tr>
              )
            }
            {
              (!selectedRange?.from && !selectedRange?.to) &&
              <tr className='bg-white'>
                <td colSpan={2} className='border-r border-gray-300 p-2 text-center'>Seleccione un rango de fechas</td>
              </tr>
            }
            {
              (data?.length === 0) && (selectedRange?.from && selectedRange.to) &&
              <tr className='bg-white'>
                <td colSpan={2} className='border-r border-gray-300 p-2 text-center'>No pending payments</td>
              </tr>
            }
            {(selectedRange?.from && selectedRange.to) && data?.map((item, index) => (
              <tr key={item.restaurantId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className='border-r border-gray-300 p-2'>{item.restaurantName}</td>
                <td className='p-2'>{item.amountToTransferFormatted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}
