import { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const ALLOWED_EMAILS = ['mohit@zango.in', 'mohitgupta.2005@gmail.com', 'mohit@fbtradings.com', 'admin@perfactfood.com'];

// Helper to safely add Google Provider only if keys exist
const providers: any[] = [
    CredentialsProvider({
        name: "Demo Admin Login",
        credentials: {
            email: { label: "Email", type: "text", placeholder: "admin@perfactfood.com" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            // Allow specified emails
            if (credentials?.email && ALLOWED_EMAILS.includes(credentials.email)) {
                return {
                    id: "1",
                    name: "Admin User",
                    email: credentials.email,
                    image: "https://ui-avatars.com/api/?name=Admin+User"
                };
            }
            // Allow demo admin
            if (credentials?.email === "admin@demo.com") {
                return {
                    id: "1",
                    name: "Demo Admin",
                    email: "admin@demo.com",
                };
            }
            return null;
        }
    })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.unshift(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

export const authOptions: NextAuthOptions = {
    providers: providers,
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-mvp-demo-only-do-not-use-in-prod-12345",
    debug: true, // Enable debug logs in Vercel
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;
            return ALLOWED_EMAILS.includes(user.email) || user.email === 'admin@demo.com';
        },
        async session({ session }) {
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
    }
};
