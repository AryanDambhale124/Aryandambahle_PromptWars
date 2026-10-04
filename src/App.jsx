import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Analysis from './pages/Analysis'

export default function App() {
  const [session, setSession] = useState(null)

  return (
    <div className="lab-bg min-h-screen flex flex-col">
      <Navbar onHome={() => setSession(null)} />
      <main className="flex-1">
        {!session && <Home onSubmit={setSession} />}
        {session && <Analysis session={session} onStartOver={() => setSession(null)} />}
      </main>
      <Footer />
    </div>
  )
}
