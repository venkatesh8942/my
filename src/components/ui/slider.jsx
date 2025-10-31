import React from "react"
    import * as SliderPrimitive from "@radix-ui/react-slider"

    import { cn } from "@/lib/utils"

    const Slider = React.forwardRef(({ className, ...props }, ref) => (
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}>
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-700">
          <SliderPrimitive.Range className="absolute h-full bg-sky-500" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-sky-500 bg-slate-800 ring-offset-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
    ))
    Slider.displayName = SliderPrimitive.Root.displayName

    export { Slider }