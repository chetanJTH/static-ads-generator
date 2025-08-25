import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Demo',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "demo" },
        password: { label: "Password", type: "password", placeholder: "demo" }
      },
      async authorize(credentials) {
        // Simple demo authentication
        if (credentials?.username === 'demo' && credentials?.password === 'demo') {
          return {
            id: 'demo-user',
            name: 'Demo User',
            email: 'demo@example.com',
          }
        }
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
