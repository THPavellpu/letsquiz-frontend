import React from 'react'
import Card from './Card'

function StatCard({
  title,
  value,
  subtitle,
  icon,
  className = '',
}) {
  return (
    <Card
      className={className}
      padding="md"
      bordered
      shadow
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {title ? (
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</div>
          ) : null}
          <div className="mt-2 text-2xl font-semibold tracking-tight">
            {value}
          </div>
          {subtitle ? (
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</div>
          ) : null}
        </div>
        {icon ? (
          <div className="text-blue-600">{icon}</div>
        ) : null}
      </div>
    </Card>
  )
}

export default StatCard

