import React from 'react'

function Badge({
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
  icon: Icon,
  ...props
}) {
  const variants = {
    neutral: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
    primary: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    danger: 'bg-red-500/20 text-red-300 border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        variants[variant] ?? variants.neutral,
        sizes[size] ?? sizes.md,
        className,
      ].join(' ')}
      {...props}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  )
}

export default Badge

