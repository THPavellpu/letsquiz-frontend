import React from 'react'
import { motion } from 'framer-motion'

function Card({
  className = '',
  children,
  padding = 'md',
  bordered = false,
  shadow = true,
  hover = false,
  delay = 0,
  ...props
}) {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={[
        'rounded-2xl bg-slate-800/50 text-slate-100 backdrop-blur-sm',
        paddingMap[padding] ?? paddingMap.md,
        bordered ? 'border border-slate-700/50' : 'border border-transparent',
        shadow ? 'shadow-lg shadow-black/5' : 'shadow-none',
        hover ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 hover:border-slate-600/50' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card

