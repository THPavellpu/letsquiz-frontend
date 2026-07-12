import React from 'react'
import { motion } from 'framer-motion'

function SectionHeader({
  title,
  description,
  action,
  icon: Icon,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={['flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between', className].join(' ')}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-slate-400">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      {action && (
        <div className="mt-3 sm:mt-0">
          {action}
        </div>
      )}
    </motion.div>
  )
}

export default SectionHeader