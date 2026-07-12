import React from 'react'
import { motion } from 'framer-motion'
import Button from './Button'

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={[
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className,
      ].join(' ')}
    >
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 mb-6">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          {description}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default EmptyState