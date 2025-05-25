import { SkipForward, RotateCcw } from 'lucide-react'


export default function ControlButtons({ onJumpTo30, onJumpTo120, onReset }: {
  onJumpTo30: () => void
  onJumpTo120: () => void
  onReset: () => void
}) {
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      onReset()
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={onJumpTo30}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
      >
        <SkipForward size={20} />
        Jump to 30s
      </button>
      
      <button
        onClick={onJumpTo120}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
      >
        <SkipForward size={20} />
        Jump to 2min
      </button>
      
      <button
        onClick={handleReset}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
      >
        <RotateCcw size={20} />
        Reset Progress
      </button>
    </div>
  )
}