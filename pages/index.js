import Layout from '@/components/Layout'
import React from 'react'
import { useSession } from 'next-auth/react'

const Home = () => {
  const { data: session } = useSession()
  if(!session) return;
  return (
    <Layout>
      <div className='text-blue-900 flex justify-between'>
        <h2>
          Hello, <b>{ session?.user?.name }</b>
        </h2>
        <div className='flex bg-gray-300 rounded-lg overflow-hidden'>
          <img src={session?.user?.image} alt="" className='w-6 h-6 '/>
          <span className='px-2'>
          {session?.user?.name}
          </span>
          
        </div>
       
      </div>
    </Layout>
  )
}

export default Home