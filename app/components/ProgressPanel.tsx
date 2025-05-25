import { Activity, Clock, BarChart3, Timer} from 'lucide-react'

export default function ProgressPanel({
  progress,
  uniqueWatchedTime,
  totalSegments,
  currentTime,
  duration
}: {
  progress: number
  uniqueWatchedTime: number
  totalSegments: number
  currentTime: number
  duration: number
}) {
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '--'
    return Math.floor(seconds) + 's'
  }

  const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds === 0) return '--'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <BarChart3 className="text-white" size={16} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Unique Progress</h2>
      </div>

      <div className="text-center mb-6">
        <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {Math.round(progress)}%
        </div>
        <div className="text-sm text-gray-500 mb-3">
          Only actively watched content counts
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 relative"
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Skipped content is not counted
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          icon={<Clock size={20} />}
          value={formatTime(uniqueWatchedTime)}
          label="Unique Time"
        />
        <StatCard
          icon={<Activity size={20} />}
          value={totalSegments.toString()}
          label="Segments"
        />
        <StatCard
          icon={<Timer size={20} />}
          value={formatTime(currentTime)}
          label="Current Position"
        />
        <StatCard
          icon={<BarChart3 size={20} />}
          value={formatDuration(duration)}
          label="Total Duration"
        />
      </div>

      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-green-700 text-sm font-medium">Tracking active segments</span>
      </div>
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors duration-200 hover:-translate-y-1">
      <div className="flex justify-center mb-2 text-gray-600">
        {icon}
      </div>
      <div className="text-xl font-semibold text-gray-800 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}
