import React from 'react'
import { motion } from 'framer-motion'

function SkeletonLoader({
  variant = 'card',
  count = 1,
  className = '',
}) {
  const variants = {
    card: 'h-48 rounded-2xl',
    text: 'h-4 rounded-lg',
    avatar: 'h-10 w-10 rounded-full',
    title: 'h-8 w-48 rounded-xl',
    button: 'h-11 w-28 rounded-2xl',
    input: 'h-11 w-full rounded-xl',
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -8 },
    show: { opacity: 1, x: 0 },
  }

  if (count === 1) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={[
          'animate-pulse bg-slate-700/50',
          variants[variant] ?? variants.card,
          className,
        ].join(' ')}
      />
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          variants={item}
          className={[
            'animate-pulse bg-slate-700/50',
            variants[variant] ?? variants.card,
          ].join(' ')}
        />
      ))}
    </motion.div>
  )
}

export default SkeletonLoader