import React from "react"
    import * as TabsPrimitive from "@radix-ui/react-tabs"
    import { cn } from "@/lib/utils"

    const Tabs = TabsPrimitive.Root

    const TabsList = React.forwardRef(({ className, ...props }, ref) => (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          "inline-flex h-auto items-center justify-start rounded-md bg-slate-700/60 p-1 text-slate-400",
          className
        )}
        {...props} />
    ))
    TabsList.displayName = TabsPrimitive.List.displayName

    const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-slate-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-slate-800 data-[state=active]:text-sky-400 data-[state=active]:shadow-sm",
          className
        )}
        {...props} />
    ))
    TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

    const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
      <TabsPrimitive.Content
        ref={ref}
        className={cn(
          "mt-2 ring-offset-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
          className
        )}
        {...props} />
    ))
    TabsContent.displayName = TabsPrimitive.Content.displayName

    export { Tabs, TabsList, TabsTrigger, TabsContent }