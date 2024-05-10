import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user.js";
import { connectToDB } from "@/utils/database.js";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      authorize: async (credentials) => {
        await connectToDB(); // Connect to your MongoDB

        const user = await User.findOne({ email: credentials.email });

        if (user) {
          if (user.password === credentials.password) {
            // Sign the user in
            return Promise.resolve(user);
          } else {
            throw new Error("Incorrect Password!");
          }
        } else {
          // User doesn't exist, sign the user up
          try {
            const newUser = {
              email: credentials.email,
              password: credentials.password,
            };
            const createdUser = await User.create(newUser);
            return createdUser;
          } catch (error) {
            console.log(error, "Failed to add user to database");
            Promise.reject("User could not be registered");
          }
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
    // error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();
      session.user.email = sessionUser.email;

      return session;
    },
  },
});

export { handler as GET, handler as POST };
