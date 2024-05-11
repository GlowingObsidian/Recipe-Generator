import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
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
          const match = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log(match, "Password match");
          if (match) {
            return Promise.resolve(user);
          } else {
            return Promise.reject(new Error("Invalid password"));
          }
        } else {
          // User doesn't exist, sign the user up
          //use bcrypt to hash the password
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          try {
            const newUser = {
              email: credentials.email,
              hashedPassword: hashedPassword,
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
