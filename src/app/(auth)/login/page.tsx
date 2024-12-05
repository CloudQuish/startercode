'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import { motion } from 'framer-motion'

export default function LoginPage() {
    return (
        <div
            
            className="min-h-screen flex items-center justify-center p-4"
        >
            <motion.div whileHover={{ scale: 1.2 }} 
                initial={{ opacity: 0, y: 200 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }} 
            className="w-full max-w-md  shadow-lg text-gray-700 border-4 rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
                <LoginForm />
            </motion.div>
        </div>
    )
}