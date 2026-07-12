import React from 'react'
import { motion } from 'framer-motion'

function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  loadingText = 'Loading...',
  disabled = false,
  children,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]'

  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 focus:ring-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500',
    secondary:
      'bg-slate-700 text-slate-100 hover:bg-slate-600 focus:ring-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600',
    outline:
      'border border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800 hover:border-slate-500 focus:ring-slate-500 dark:border-slate-600 dark:hover:bg-slate-800',
    ghost:
      'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white focus:ring-slate-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
    danger:
      'bg-red-600 text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-500',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500',
  }

  const sizes = {
    sm: 'h-10 px-4 text-sm gap-1.5',
    md: 'h-12 px-5 text-sm gap-2',
    lg: 'h-14 px-6 text-base gap-2',
  }

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span>{loadingText}</span>
        </span>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="h-4 w-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-4 w-4" />}
        </>
      )}
    </motion.button>
  )
}

export default Button

