import React from 'react'

function ProgressBar({
  value = 0,
  max = 100,
  className = '',
  showPercent = true,
}) {
  const percent = max === 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div className={['w-full', className].join(' ')}>
      <div className="flex items-center justify-between gap-3">
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-blue-600 transition-[width] duration-300"

            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      {showPercent ? (
        <div className="mt-1 text-right text-xs text-gray-600 dark:text-gray-300">

          {Math.round(percent)}%
        </div>
      ) : null}
    </div>
  )
}

export default ProgressBar

