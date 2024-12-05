// lib/auth-guard.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const checkAuthentication = async (shouldBeAuthenticated = true) => {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (shouldBeAuthenticated && !session) {
        redirect('/login');
    }

    if (!shouldBeAuthenticated && session) {
        redirect('/dashboard');
    }

    return { session };
};