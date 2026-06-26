import React from 'react'

function Card({
  className = '',
  children,
  padding = 'md',
  bordered = false,
  shadow = true,
  ...props
}) {
  const paddingMap = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      className={[
        'rounded-xl bg-white text-gray-900 dark:bg-slate-800 dark:text-slate-100',
        paddingMap[padding] ?? paddingMap.md,
        bordered ? 'border border-gray-200 dark:border-slate-700' : 'border border-transparent',
        shadow ? 'shadow-sm' : 'shadow-none',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

