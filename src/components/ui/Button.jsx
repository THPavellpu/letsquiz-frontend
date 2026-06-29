import React from 'react'

function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  loadingText = 'Loading...',
  disabled = false,
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    ghost:
      'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-300 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:ring-gray-600',
    outline:
      'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-600',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700',
  }

  const sizes = {
    // Mobile-first: ensure minimum touch target height (>=48px)
    sm: 'h-12 px-4 text-base',
    md: 'h-12 px-5 text-base',
    lg: 'h-12 px-6 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button

