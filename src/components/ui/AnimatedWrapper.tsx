// components/ui/AnimatedWrapper.tsx
import { motion, MotionProps } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedWrapperProps extends MotionProps {
    children: ReactNode
    className?: string
}

export const AnimatedWrapper = ({
    children,
    className = "",
    ...props
}: AnimatedWrapperProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}