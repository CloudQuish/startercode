'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function ForgotPasswordForm() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState<string | null>(null)
    const { resetPassword, isLoading, error } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const response = await resetPassword(email)

        if (response.error) {
            setMessage(response.error.message)
        } else {
            setMessage('Password reset email sent. Check your inbox.')
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl text-center">Forgot Password</h2>

                {message && (
                    <div className={`
            text-center p-2 rounded 
            ${error ? 'text-red-500 bg-red-100' : 'text-green-500 bg-green-100'}
          `}>
                        {message}
                    </div>
                )}

                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? 'Sending...' : 'Reset Password'}
                </Button>

                <div className="text-center mt-4">
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    )
}