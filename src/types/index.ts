export type AuthFormData = {
    email: string;
    password: string;
    confirmPassword?: string;
};

export type AuthProviders = 'google' | 'github';


export interface AuthError {
    message: string;
}

export interface AuthResponse {
    authData?: any;
    error?: AuthError;
}

export interface Profile {
    id: string;
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    email?: string | null;
    role?: string;
    last_login?: string;
}