import React from 'react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function Loader({ size = 'md' }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
    </div>
  )
}