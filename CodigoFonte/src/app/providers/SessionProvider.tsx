'use client'
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import type { Session } from 'next-auth';

interface NextAuthSessionProviderProps {
  children: ReactNode;
  session?: Session | null;
}

export default function NextAuthSessionProvider({ children, session }: NextAuthSessionProviderProps) {
  return (
    <SessionProvider session={session} refetchInterval={30 * 60} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}