// components/ui/Toast.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
    message: string
    type?: ToastType
    duration?: number
    onClose?: () => void
}

export const Toast = ({
    message,
    type = 'info',
    duration = 3000,
    onClose
}: ToastProps) => {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false)
            onClose?.()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    const typeStyles = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-black",
        info: "bg-blue-500 text-white"
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${typeStyles[type]}`}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Hook for managing toasts
export const useToast = () => {
    const [toast, setToast] = useState<ToastProps | null>(null)

    const showToast = (options: ToastProps) => {
        setToast(options)
    }

    const hideToast = () => {
        setToast(null)
    }

    return { toast, showToast, hideToast }
}