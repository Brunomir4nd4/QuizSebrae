import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { baseUrl } from './consts';
import { sendLog } from '@/app/services/external/LogsService';

export const nextAuthOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: 'Credentials',
			// `credentials` is used to generate a form on the sign in page.
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				const username = credentials?.username;
				const password = credentials?.password;

				/* const response = await fetch(
					`${process.env.NEXT_PUBLIC_API}/api/jwt-auth/v1/token`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							username: username,
							password: password,
						}),
					},
				); */

				const response = await fetch(`${baseUrl}/api/jwt-auth/v1/token`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username: username,
						password: password,
					}),
				});
				const user = await response.json();

				if (user.token) {
					if (user.role[0] === 'subscriber' && user.enroll_ids) {
						const enrollIdsArray = Array.isArray(user.enroll_ids)
							? user.enroll_ids
							: [user.enroll_ids];

						for (const id of enrollIdsArray) {
							await sendLog(user.token, {
								subscriber_id: id,
								action: 'Logou no HUB',
							});
						}
					}

					if (user.role[0] === 'administrator') user.role[0] = 'supervisor';
					// Any object returned will be saved in `user` property of the JWT
					return user;
				} else {
					// If you return null then an error will be displayed advising the user to check their details.
					return null;

					// You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
				}
			},
		}),
	],
	pages: {
		signIn: '/',
	},
	callbacks: {
		async jwt({ token, user }) {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			user && (token.user = user);
			return token;
		},
		async session({ session, token }) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			session = token as any;
			return session;
		},
	},
	session: {
		maxAge: 24 * 60 * 60 * 7, // 7 days in seconds
	},
	jwt: {
		maxAge: 24 * 60 * 60 * 7, // 7 days in seconds
	},
};
