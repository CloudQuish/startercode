'use client'

import { signInWithProvider } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { FaGoogle, FaGithub } from 'react-icons/fa'

export function SocialLogins() {
    const handleGoogleSignIn = async () => {
        await signInWithProvider('google')
    }

    const handleGitHubSignIn = async () => {
        await signInWithProvider('github')
    }

    return (
        <div className="flex space-x-4 mx-auto justify-center">
            <Button
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center space-x-2"
            >
                <FaGoogle /> <span>Google</span>
            </Button>
            <Button
                onClick={handleGitHubSignIn}
                className="flex items-center justify-center space-x-2"
            >
                <FaGithub /> <span>GitHub</span>
            </Button>
        </div>
    )
}