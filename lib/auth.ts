import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const ALLOWED_EMAILS = ['mohit@zango.in', 'mohitgupta.2005@gmail.com', 'mohit@fbtradings.com', 'admin@perfactfood.com'];

export const authOptions: NextAuthOptions = {
    providers: [
        ...(process.env.GOOGLE_CLIENT_ID ? [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            })
        ] : []),
        CredentialsProvider({
            name: "Demo Admin Login",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "admin@perfactfood.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (credentials?.email && ALLOWED_EMAILS.includes(credentials.email)) {
                    return {
                        id: "1",
                        name: "Admin User",
                        email: credentials.email,
                        image: "https://ui-avatars.com/api/?name=Admin+User"
                    };
                }
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
    ],
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
