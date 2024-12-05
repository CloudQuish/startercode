'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

export function Navbar() {
    const { user, handleSignOut } = useAuth()

    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 text-white p-4"
        >
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    Auth App
                </Link>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="hover:text-gray-300">
                                Dashboard
                            </Link>
                            <Link href="/profile" className="hover:text-gray-300">
                                Profile
                            </Link>
                            <Button onClick={handleSignOut} variant="destructive">
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-gray-300">
                                Login
                            </Link>
                            <Link href="/register" className="hover:text-gray-300">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    )
}