import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google-login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: user.name,
    email: user.email,
    profile_pic: user.image,
  }),
});

        const data = await response.json();
        console.log("Backend response:", data); // ← check frontend terminal
        console.log("Token:", data.token);       // ← is token here?

        user.token = data.token;
        console.log("user.token set:", user.token); // ← is it set?
        return true;
      } catch (error) {
        console.error("Google login error:", error);
        return true;
      }
    },

    async jwt({ token, user }) {
      console.log("JWT callback - user:", user);           // ← check terminal
      console.log("JWT callback - user.token:", user?.token); // ← is token here?
      if (user) token.accessToken = user.token;
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback - token:", token); // ← check terminal
      session.accessToken = token.accessToken;
      return session;
    },
  },
});