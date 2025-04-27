import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabase } from '../../../../lib/supabaseClient'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user?.email) {
          console.error('No email provided in user object')
          return false
        }

        // Check if user exists in Supabase
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single()

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // User not found, proceed with creation
            console.log('User not found, creating new user:', user.email)
          } else {
            console.error('Error checking user existence:', fetchError)
            return false
          }
        }

        // If user doesn't exist, create a new user record
        if (!existingUser) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                email: user.email,
                name: user.name,
                avatar_url: user.image
              }
            ])

          if (insertError) {
            console.error('Error creating user:', insertError)
            return false
          }
          
          console.log('Successfully created new user:', user.email)
        }

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
})

export { handler as GET, handler as POST } 