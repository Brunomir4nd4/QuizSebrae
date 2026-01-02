import NextAuth from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			user_display_name: string;
			user_email: string;
			user_nicename: string;
			role: string[];
			token: string;
			user_first_name: string;
			user_last_name: string;
		};
	}
}
