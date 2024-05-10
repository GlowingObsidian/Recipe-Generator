"use client";

import { SessionProvider } from "next-auth/react";

const NextAuthProvider = ({ children, session }) => (
  <SessionProvider session={session}>{children}</SessionProvider>
);

export default NextAuthProvider;
