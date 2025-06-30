'use client'

import { Calendar } from '@/components/ui/calendar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Loader from '@/components/ui/loader';
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
            <th className='border-b border-r border-gray-300 p-2 text-left'>Nombre del restaurante</th>
            <th className='border-b border-r border-gray-300 p-2 text-left'>Total a transferir</th>
            <th className='border-b border-gray-300 p-2 text-left'>Total generado</th>
          </tr>
        </thead>
        <tbody>
          {
            isLoading && (
              <tr className='bg-white'>
                <td colSpan={3} className='border-r border-gray-300 p-2 text-center'>
                  <Loader />
                </td>
              </tr>
            )
          }
          {
            (!selectedRange?.from && !selectedRange?.to) &&
            <tr className='bg-white'>
              <td colSpan={3} className=' p-2 text-center'>Seleccione un rango de fechas</td>
            </tr>
          }
          {
            (data?.length === 0) && (selectedRange?.from && selectedRange.to) &&
            <tr className='bg-white'>
              <td colSpan={3} className='border-r border-gray-300 p-2 text-center'>No pending payments</td>
            </tr>
          }
          {(selectedRange?.from && selectedRange.to) && data?.map((item, index) => (
            <tr key={item.restaurantId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className='border-r border-gray-300 p-2'>
                {item.restaurantName}
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-sm text-blue-600 hover:text-blue-800">
                    View Orders ({item.orders.length})
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-96">
                    <DropdownMenuLabel>Orders List</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-60 overflow-auto">
                      {item.orders.map((order, orderIndex) => (
                        <DropdownMenuItem key={orderIndex}>
                          <div className='flex flex-col gap-1'>
                            <span className='font-medium'>Order #{order.id}</span>
                            <div className='grid grid-cols-2 text-sm text-gray-700 border-b border-gray-300'>
                              <p className='text-sm text-gray-600'><strong>Total:</strong> {order.total}</p>
                              <p className='text-left'><strong>Creada en:</strong> {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
                            </div>
                            <div>
                              <p><strong>Comidas</strong></p>
                              <ul className='space-y-3'>
                                {
                                  order.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className='flex justify-between items-start text-gray-800 text-sm'>
                                      <p>{item.quantity} x {item.meal?.name}</p>
                                      <p>{item.quantity * (item.mealPrice)}</p>
                                    </li>
                                  ))
                                }
                              </ul>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
              <td className='border-r border-gray-300 p-2'>{item.amountToTransferFormatted}</td>
              <td className='p-2'>{item.amountGeneratedFormatted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
