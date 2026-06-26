import React from 'react'

function LoadingSpinner({ size = 20, className = '' }) {
  return (
    <div
      className={['animate-spin rounded-full border-2 border-gray-200 dark:border-gray-800 border-t-blue-600', className].join(' ')}

      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    />
  )
}

export default LoadingSpinner

