import React from 'react'

function Input({
  label,
  error,
  hint,
  className = '',
  ...props
}) {
  const hasError = Boolean(error)

  return (
    <div className="w-full">
      {label ? (
        <label className="mb-1 block text-sm font-medium text-slate-300">
          {label}
        </label>
      ) : null}

      <input
        className={[
          'w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors',
          hasError
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-700 dark:focus:border-red-400 dark:focus:ring-red-900/40'
            : 'border-slate-600 bg-slate-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-900/40',
          className,
        ].join(' ')}
        {...props}
      />

      {hasError ? (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      ) : null}
    </div>
  )
}

export default Input

