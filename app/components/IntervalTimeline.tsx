import { BarChart } from 'lucide-react'
import type { Interval } from "../types/interval"


export default function IntervalTimeline({ intervals, duration, currentTime }: {
  intervals: Interval[]
  duration: number
  currentTime: number
}) {
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <BarChart className="text-white" size={16} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Watched Segments Timeline</h2>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 relative" style={{ height: '80px' }}>
        <div className="absolute top-1/2 left-6 right-6 h-2 bg-gray-300 rounded-full transform -translate-y-1/2">
          {/* Current position indicator */}
          {duration > 0 && (
            <div
              className="absolute top-0 w-1 h-2 bg-red-500 rounded-full transform -translate-x-1/2 z-10"
              style={{ left: `${Math.min((currentTime / duration) * 100, 100)}%` }}
            />
          )}
          
          {/* Watched segments */}
          {duration > 0 && intervals.map((interval, index) => (
            <div
              key={index}
              className="absolute top-0 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full hover:h-3 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-sm"
              style={{
                left: `${Math.min((interval.start / duration) * 100, 100)}%`,
                width: `${Math.min(((interval.end - interval.start) / duration) * 100, 100 - (interval.start / duration) * 100)}%`
              }}
              title={`${formatTime(interval.start)} - ${formatTime(interval.end)}`}
            />
          ))}
        </div>
        
        {duration === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
            Waiting for video to load...
          </div>
        )}
      </div>
    </div>
  )
}
