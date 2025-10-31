import React from "react"
    import { cn } from "@/lib/utils"

    const Textarea = React.forwardRef(({ className, ...props }, ref) => {
      return (
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-50 ring-offset-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props} />
      )
    })
    Textarea.displayName = "Textarea"

    export { Textarea }