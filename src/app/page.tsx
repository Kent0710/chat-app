// import Link from 'next/link'

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center  p-24">
//       <Link href="/register">Register</Link>
//       <Link href="/dashboard">Dashboard</Link>
//     </main>
//   )
// }

import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col bg-blue-500 items-center justify-center h-screen gap-3">
      <h1> Authentication Page </h1>
      <div className=' bg-violet-300 hover:bg-cyan-800 p-2 rounded-md'>
       <Link href="/register">Register</Link>
      </div>
      <div className='bg-violet-300 hover:bg-cyan-800 p-2 rounded-md'>
        <Link href="/signIn">Sign In</Link>
      </div>
    </main>
  )
}
