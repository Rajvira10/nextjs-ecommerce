import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const adminEmails = ['rajvir.ahmed.shuvo@g.bracu.ac.bd']

export const authOptions = ({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({session, token, user}) => {
      if(adminEmails.includes(session?.user?.email)){
        return session;
      } else{
        return false;
      }
    }
  }
})

export default NextAuth(authOptions);

export async function isAdminRequest(req,res) {
  const session = await getServerSession(req,res,authOptions);
  if (adminEmails.includes(session?.user?.email)){
    throw 'not an admin';
  }
}