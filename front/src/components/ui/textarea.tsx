import * as React from 'react'

import { cn } from '../../lib/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-32 w-full rounded-xl border border-brand-primary/25 bg-brand-dark/60 px-3 py-2 text-sm text-brand-light ring-offset-brand-dark placeholder:text-brand-light/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/80 disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
