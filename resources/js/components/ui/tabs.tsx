import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

/* ---------------- ROOT ---------------- */
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

/* ---------------- LIST ---------------- */
function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: "default" | "sub"
}) {
  return (
    <TabsPrimitive.List
      className={cn(
        variant === "sub" &&
          `
          flex gap-6
          bg-white
          p-2
          border
        `,
        className
      )}
      {...props}
    />
  )
}

/* ---------------- TRIGGER ---------------- */
function TabsTrigger({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  variant?: "default" | "sub"
}) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        variant === "sub" &&
`
  p-2
  font-semibold
  border-b-2
  border-transparent
  text-gray-600
  cursor-pointer
  transition-colors
  data-[state=active]:border-kseb-primary
  data-[state=active]:text-kseb-primary
  data-[state=active]:bg-blue-50
`
,
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger }
