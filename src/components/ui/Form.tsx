// components/ui/Form.tsx
import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    children: React.ReactNode
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <motion.form
                ref={ref}
                className={cn("space-y-6", className)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                {...props}
            >
                {children}
            </motion.form>
        )
    }
)
Form.displayName = "Form"

export { Form }