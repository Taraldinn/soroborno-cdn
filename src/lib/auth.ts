import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
            authorization: {
                params: {
                    scope: 'read:user user:email repo',
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            if (profile) {
                // @ts-ignore - GitHub profile type
                token.username = profile.login;
            }
            return token;
        },
        async session({ session, token }) {
            // @ts-ignore - Add custom fields
            session.accessToken = token.accessToken;
            // @ts-ignore
            session.user.username = token.username;
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
    },
};
