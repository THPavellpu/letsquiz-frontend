import React, { useId } from 'react'
import { forwardRef } from 'react'

const Input = forwardRef(function Input({
  label,
  error,
  hint,
  className = '',
  icon: Icon,
  id,
  ...props
}, ref) {
  const hasError = Boolean(error)
  const generated = useId();
  const inputId = id || `input-${generated}`;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-slate-300">
          {label}
        </label>
      ) : null}

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : hint ? `${inputId}-hint` : undefined}
          className={[
            'w-full rounded-xl border bg-slate-800/50 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 h-12',
            Icon ? 'pl-12' : '',
            hasError
              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            'placeholder:text-slate-500',
            className,
          ].join(' ')}
          {...props}
        />
      </div>

      {hasError ? (
        <p id={errorId} role="alert" aria-live="assertive" className="mt-2 text-sm font-medium text-red-400">{error}</p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-2 text-sm text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
})

export default Input

