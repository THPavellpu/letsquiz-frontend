import React from 'react'
import { motion } from 'framer-motion'
import Card from './Card'

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'indigo',
  className = '',
  delay = 0,
}) {
  const iconColors = {
    indigo: 'bg-indigo-500/20 text-indigo-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
    purple: 'bg-purple-500/20 text-purple-400',
    rose: 'bg-rose-500/20 text-rose-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
    >
      <Card
        className={className}
        padding="md"
        bordered
        shadow
        hover
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {title ? (
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</div>
            ) : null}
            <div className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {value}
            </div>
            {subtitle ? (
              <div className="mt-1 text-sm text-slate-400">{subtitle}</div>
            ) : null}
          </div>
          {Icon ? (
            <div className={[
              'flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl shrink-0',
              iconColors[iconColor] || iconColors.indigo,
            ].join(' ')}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          ) : null}
        </div>
      </Card>
    </motion.div>
  )
}

export default StatCard

