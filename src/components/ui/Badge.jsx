import React from 'react'

function Badge({
  variant = 'neutral',
  className = '',
  children,
  ...props
}) {
  const variants = {
    neutral: 'bg-slate-700 text-slate-200 border-slate-600',
    primary: 'bg-blue-900/40 text-blue-100 border-blue-700',
    success: 'bg-emerald-900/40 text-emerald-100 border-emerald-700',
    warning: 'bg-amber-900/40 text-amber-100 border-amber-700',
    danger: 'bg-red-900/40 text-red-100 border-red-700',
  }

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant] ?? variants.neutral,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge

