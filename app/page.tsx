"use client"
import { useRouter } from 'next/navigation'
import VideoProgressTracker from './components/VideoProgressTracker'
import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'


// Main App Component
export default function App() {
   const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
    <header className="flex justify-between items-center h-20 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md shadow-md border border-white/20 mb-6">
  {/* Left section: Logo + Title */}
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md">
      <span className="text-indigo-600 text-xl font-bold">🎓</span>
    </div>
    <h1 onClick={() => router.push('/')} className="cursor-pointer text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-white animate-fade-in">
      Smart Learning Tracker
    </h1>
  </div>

  {/* Right section: Buttons */}
  <div className="flex items-center gap-3">
    <button  onClick={() => router.push('/admin')} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md transition-all duration-200">
      Admin
    </button>

    <SignedOut>
      <button  onClick={() => window.location.href = '/sign-in'} className="px-4 py-2 text-sm font-semibold bg-white text-indigo-600 border border-indigo-600 rounded-xl hover:bg-indigo-50 shadow transition-all">
        Sign In
      </button>
      <button  onClick={() => window.location.href = '/sign-up'} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md transition-all">
        Sign Up
      </button>
    </SignedOut>

    <SignedIn>
      <UserButton
        appearance={{
          elements: {
            avatarBox: 'ring-2 ring-indigo-500',
            userButtonPopoverCard: 'bg-white shadow-lg rounded-xl',
          },
        }}
      />
    </SignedIn>
  </div>
</header>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              📚 Smart Learning Tracker
            </h1>
            <p className="text-gray-600 text-lg">
              Track your unique video progress with precision
            </p>
          </header>

          <VideoProgressTracker />
        </div>
      </div>
    </div>
  )
}