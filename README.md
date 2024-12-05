# Next.js Authentication with Supabase and Framer Motion

## Personal Information

- **Name**: [Jay Shyam Patel]
- **Email**: [jayshyampatel133@gmail.com]
- **Phone**: [+977-9843-818406]
- **Role Applied For**: Generalist Developer
- **Address**: Satungal, Kathmandu, Nepal
- **LinkedIn**: [Your LinkedIn Profile](https://www.linkedin.com/in/jay-shyam-patel/)
- **GitHub**: [\[Your GitHub Profile\]](https://github.com/novaprime-code)

## Time Log

| Date | Time Spent (hrs) | Task Description |
|------|------------------|------------------|
| 2024-12-04 | 4 | Research, Project setup, initial configuration |
| 2024-12-05 | 2 | Research, Authentication flow implementation |
| 2024-12-05 | 1 | Research, Adding animations and polishing UI |

## Project Overview

This project demonstrates a modern authentication system built with Next.js 14, Supabase, and Framer Motion. It features a polished user interface with smooth animations and comprehensive authentication flows including email/password, social logins (Google, GitHub), and password recovery.

### Key Features

- Email and password authentication
- Social login integration (Google, GitHub)
- Password reset functionality
- Protected routes with middleware
- Responsive design with Tailwind CSS
- Smooth page transitions and micro-interactions using Framer Motion
- Type safety with TypeScript
- Server-side rendering with Next.js 14
- Database and authentication via Supabase

### Technology Choices

#### Next.js 14

**Why**: Next.js 14 provides:

- Server-side rendering for better SEO and initial load performance
- App Router for simplified routing and layouts
- API routes for backend functionality
- Built-in TypeScript support
- Enhanced developer experience with hot reloading

#### Supabase

**Why**: Supabase offers:

- Built-in authentication with multiple providers
- Real-time database capabilities
- Row Level Security for data protection
- PostgreSQL database
- Easy-to-use client libraries
- Generous free tier for development

#### Framer Motion

**Why**: Framer Motion provides:

- Declarative animations
- Gesture support
- Layout animations
- Server-side rendering compatibility
- Small bundle size

#### Additional Technologies

- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For rapid UI development and consistent styling
- **Zod**: For form validation and type inference
- **shadcn/ui**: For pre-built accessible components

## Research Process

### Key Learnings

#### Supabase Authentication

1. Server-side vs. Client-side Auth
   - Learned to handle authentication both on server and client
   - Implemented middleware for protected routes
   - Managed session persistence

2. Social Login Implementation
   - Configured OAuth providers in Supabase dashboard
   - Handled redirect URLs and callback routes
   - Managed user metadata from social providers

#### Framer Motion Integration

1. Server-Side Rendering
   - Learned to handle animations with SSR
   - Implemented layout animations without flickering
   - Created reusable animation components

2. Performance Optimization
   - Implemented lazy loading for animation components
   - Managed animation performance on mobile devices
   - Created efficient page transitions

### Challenges and Solutions

1. **Challenge**: Session Management in Next.js 14
   **Solution**: Implemented custom middleware and hooks to handle session state:

   ```typescript
   // lib/auth-guard.ts
   export async function authGuard() {
     const supabase = createServerClient();
     const { data: { session } } = await supabase.auth.getSession();
     if (!session) {
       redirect('/login');
     }
     return session;
   }
   ```

2. **Challenge**: Social Login Redirects
   **Solution**: Created dedicated callback routes and proper error handling:

   ```typescript
   // app/auth/callback/route.ts
   export async function GET(request: NextRequest) {
     const requestUrl = new URL(request.url);
     const code = requestUrl.searchParams.get('code');
     
     if (code) {
       const supabase = createServerClient();
       await supabase.auth.exchangeCodeForSession(code);
     }
     
     return NextResponse.redirect(new URL('/dashboard', request.url));
   }
   ```

3. **Challenge**: Animation Performance
   **Solution**: Implemented progressive enhancement and reduced animation complexity on mobile:

   ```typescript
   // components/ui/AnimatedWrapper.tsx
   const variants = {
     hidden: { opacity: 0, y: 20 },
     visible: { 
       opacity: 1, 
       y: 0,
       transition: { duration: 0.3 }
     }
   };
   ```

## Implementation Guide

### 1. Project Setup

```bash
# Clone the repository
git clone git@github.com:novaprime-code/startercode.git
cd nextjs-supabase-auth

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### 2. Supabase Configuration

1. Create a new Supabase project
2. Configure authentication providers in Supabase dashboard
3. Add environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Local Development

```bash
# Run development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### 4. Production Deployment

1. Create a Vercel account
2. Connect your GitHub repository
3. Configure environment variables in Vercel dashboard
4. Deploy:

```bash
npm run build
vercel --prod
```

## API Documentation

### Authentication Endpoints

#### Register User

```typescript
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Login User

```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

## Future Improvements

1. Enhanced Security Features
   - Two-factor authentication
   - Magic link authentication
   - Session management improvements

2. Performance Optimizations
   - Implement route prefetching
   - Add image optimization
   - Enhance animation performance

3. Additional Features
   - User profile management
   - Email verification
   - Role-based access control

<!-- ## Live Demo

Access the live demo at: [https://your-demo-url.vercel.app](https://your-demo-url.vercel.app) -->

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.