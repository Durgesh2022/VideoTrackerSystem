"use client"
import { useState, useCallback, useEffect } from "react"
import { useUser } from "@clerk/nextjs"

type Interval = {
  start: number
  end: number
  segment: number
}

type MergedSegmentMap = {
  fromSegments: number[]
  mergedInto: number
}

function generateRandomVideoId(): string {
  return Math.floor(100000000 + Math.random() * 900000000).toString()
}

const VIDEO_ID = generateRandomVideoId()

export default function useVideoProgress() {
  const { user } = useUser()
  const [watchedIntervals, setWatchedIntervals] = useState<Interval[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [mergedMap, setMergedMap] = useState<MergedSegmentMap[]>([])

  const mergeIntervals = useCallback((intervals: Interval[]): { merged: Interval[], mergedMap: MergedSegmentMap[] } => {
    if (intervals.length <= 1) return {
      merged: intervals.map((int, i) => ({ ...int, segment: i + 1 })),
      mergedMap: intervals.map((_, i) => ({ fromSegments: [i + 1], mergedInto: i + 1 }))
    }

    const sorted = [...intervals].sort((a, b) => a.start - b.start)
    const merged: Interval[] = []
    const mergedFrom: number[][] = []

    let current = { ...sorted[0], segment: 1 }
    let mergedIndices = [sorted[0].segment || 1]

    for (let i = 1; i < sorted.length; i++) {
      const next = sorted[i]
      if (next.start <= current.end) {
        current.end = Math.max(current.end, next.end)
        mergedIndices.push(next.segment || i + 1)
      } else {
        merged.push({ ...current, segment: merged.length + 1 })
        mergedFrom.push([...mergedIndices])
        current = { ...next, segment: merged.length + 2 }
        mergedIndices = [next.segment || i + 1]
      }
    }

    merged.push({ ...current, segment: merged.length + 1 })
    mergedFrom.push([...mergedIndices])

    const map: MergedSegmentMap[] = merged.map((seg, i) => ({
      fromSegments: mergedFrom[i],
      mergedInto: seg.segment
    }))

    return { merged, mergedMap: map }
  }, [])

  const addInterval = useCallback(async (start: number, end: number) => {
    if (end > start && (end - start) >= 0.1) {
      setWatchedIntervals(prev => {
        const newIntervals = [...prev, { start, end, segment: prev.length + 1 }]
        const { merged, mergedMap } = mergeIntervals(newIntervals)
        localStorage.setItem("watchedSegments", JSON.stringify(merged))
        setMergedMap(mergedMap)

        fetch("/api/save-progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user?.id || "anonymous",
            videoId: VIDEO_ID,
            intervals: merged,
            mergedMap
          })
        }).catch(err => console.error("Error saving intervals:", err))

        return merged
      })
    }
  }, [mergeIntervals, user])

  const calculateUniqueWatchedTime = useCallback(() => {
    return watchedIntervals.reduce((total, interval) => total + (interval.end - interval.start), 0)
  }, [watchedIntervals])

  const resetProgress = useCallback(() => {
    setWatchedIntervals([])
    localStorage.removeItem("watchedSegments")
  }, [])

  const uniqueWatchedTime = calculateUniqueWatchedTime()
  const currentProgress = duration > 0 ? Math.min((uniqueWatchedTime / duration) * 100, 100) : 0

  return {
    watchedIntervals,
    currentProgress,
    isPlaying,
    currentTime,
    duration,
    uniqueWatchedTime,
    addInterval,
    resetProgress,
    setIsPlaying,
    setCurrentTime,
    setDuration
  }
}
