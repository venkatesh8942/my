import React from "react"
    import { cn } from "@/lib/utils"

    const Card = React.forwardRef(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("rounded-lg border border-slate-700 bg-slate-800/70 text-slate-50 shadow-xl backdrop-blur-sm", className)}
        {...props} />
    ))
    Card.displayName = "Card"

    const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props} />
    ))
    CardHeader.displayName = "CardHeader"

    const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
      <h3
        ref={ref}
        className={cn("text-2xl font-semibold leading-none tracking-tight text-sky-400", className)}
        {...props} />
    ))
    CardTitle.displayName = "CardTitle"

    const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
      <p
        ref={ref}
        className={cn("text-sm text-slate-400", className)}
        {...props} />
    ))
    CardDescription.displayName = "CardDescription"

    const CardContent = React.forwardRef(({ className, ...props }, ref) => (
      <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    ))
    CardContent.displayName = "CardContent"

    const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props} />
    ))
    CardFooter.displayName = "CardFooter"

    export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }