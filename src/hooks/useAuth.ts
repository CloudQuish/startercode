// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthFormData } from '../types';
import { createClient } from '@/lib/supabase/client';
import { signUp, signIn, signInWithProvider, signOut, resetPassword } from '../lib/auth';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignUp = async (data: AuthFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const { authData, error } = await signUp(data);

            if (error) {
                setError(error.message);
                return false;
            }

            return true;
        } catch (err) {
            setError('An unexpected error occurred');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async (data: AuthFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const { authData, error } = await signIn(data);
            console.log('authData', authData);
            if (error) {
                setError(error.message);
                return false;
            }

            return true;
        } catch (err) {
            setError('An unexpected error occurred');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await signOut();
            setUser(null);
            setSession(null);
        } catch (error) {
            setError('Error signing out');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        session,
        loading,
        isLoading,
        error,
        handleSignUp,
        handleSignIn,
        handleSignOut,
        signInWithProvider,
        resetPassword,
    };
};