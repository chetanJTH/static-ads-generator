import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      subscriptionStatus?: string
      subscriptionPlan?: string
    } & DefaultSession["user"]
  }

  interface User {
    subscriptionStatus?: string
    subscriptionPlan?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    subscriptionStatus?: string
    subscriptionPlan?: string
  }
}
