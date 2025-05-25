"use client"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

type Interval = {
  start: number
  end: number
  segment: number
}

type MergedSegmentMap = {
  fromSegments: number[]
  mergedInto: number
}

type ProgressData = {
  _id: string
  videoId: string
  intervals: Interval[]
  mergedMap?: MergedSegmentMap[]
  updatedAt: string
}

export default function ProgressPage() {
      const router = useRouter()
  const [data, setData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/get-progress")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center text-gray-600 text-lg">Loading...</p>
  if (error) return <p className="text-center text-red-500 text-lg">Error: {error}</p>

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
        <button onClick={() => router.push('/admin')} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md transition-all duration-200">
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
    <div className="overflow-x-auto">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-white mb-6 text-center">
        🎥 Video Progress Records
      </h2>

      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        <table className="min-w-full table-auto text-sm bg-white">
            
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-left text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Video ID</th>
              <th className="px-6 py-3">Intervals<br />(start - end - segment)</th>
              <th className="px-6 py-3">Merged Map<br />(from-Segments → merged-Into)</th>
              <th className="px-6 py-3">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ _id, videoId, intervals, mergedMap, updatedAt }, idx) => (
              <tr
                key={_id}
                className={idx % 2 === 0 ? "bg-white hover:bg-indigo-50" : "bg-gray-50 hover:bg-indigo-100"}
              >
                <td className="px-6 py-4 font-medium text-gray-800">{videoId}</td>
                <td className="px-6 py-4 whitespace-pre-wrap text-gray-700">
                  {intervals
                    .map(i => `(${i.start.toFixed(2)} - ${i.end.toFixed(2)} - ${i.segment})`)
                    .join("\n")}
                </td>
                <td className="px-6 py-4 whitespace-pre-wrap text-gray-700">
                  {mergedMap?.length
                    ? mergedMap.map(m => `${m.fromSegments.join(", ")} → ${m.mergedInto}`).join("\n")
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}
