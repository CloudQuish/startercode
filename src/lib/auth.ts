import { createClient } from './supabase/client';
import { AuthFormData, AuthResponse } from '@/types';

const supabase = createClient();

export const signUp = async (data: AuthFormData): Promise<AuthResponse> => {
    if (data.password !== data.confirmPassword) {
        return { error: { message: 'Passwords do not match' } };
    }

    const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
        }
    });

    if (error) {
        return { error: { message: error.message } };
    }

    return { authData };
};

// src/lib/auth.ts
export const signIn = async (data: AuthFormData): Promise<AuthResponse> => {
    console.log('Attempting sign in with:', { email: data.email });

    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
    });

    console.log('Sign in response:', { authData, error });

    if (error) {
        return { error: { message: error.message } };
    }

    return { authData };
};
export const signInWithProvider = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    });

    if (error) {
        console.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} Sign In Error:`, error);
        return false;
    }

    return true;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Sign Out Error:', error);
        return false;
    }

    return true;
};

export const resetPassword = async (email: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
        return { error: { message: error.message } };
    }

    return { authData: data };
};