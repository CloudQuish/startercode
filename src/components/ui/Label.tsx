// components/ui/Label.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement> { }

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => (
        <label
            ref={ref}
            className={cn(
                "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                className
            )}
            {...props}
        />
    )
)
Label.displayName = "Label"

export { Label }