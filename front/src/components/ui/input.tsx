import * as React from 'react'

import { cn } from '../../lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-brand-primary/25 bg-brand-dark/60 px-3 py-2 text-sm text-brand-light ring-offset-brand-dark transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-brand-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/80 disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
