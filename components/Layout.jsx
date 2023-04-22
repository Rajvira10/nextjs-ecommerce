import { useSession, signIn, signOut } from "next-auth/react"
import Navbar from './Navbar'

export default function Layout({children}) {
  const { data: session } = useSession()
  if(!session){
    return (
     <div className='bg-blue-900 w-screen h-screen flex items-center'>
      <div className='text-center w-full'>
        <button className='bg-white p-2 px-4 text-black rounded-lg' onClick={()=>signIn('google')}>Login with Google</button>
      </div>
     </div>
    )
  }
  else{
    return(
      <div className='bg-blue-900 min-h-screen flex'>
        <Navbar/>
        <div className='bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4'>{children}</div>
      </div>
    )
  }

}
