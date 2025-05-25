"use client"
import { useState, useEffect, useRef, useCallback } from 'react'

import ControlButtons from './ControlButtons'
import useVideoProgress from './useVideoProgress'
import IntervalTimeline from './IntervalTimeline'
import VideoPlayer from './VideoPlayer'
import ProgressPanel from './ProgressPanel'
export default function VideoProgressTracker() {
  const {
    watchedIntervals,
    currentProgress,
    isPlaying,
    currentTime,
    duration,
    uniqueWatchedTime,
    addInterval,
    resetProgress,
    setCurrentTime: updateCurrentTime,
    setIsPlaying,
    setDuration
  } = useVideoProgress()

  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentWatchStart, setCurrentWatchStart] = useState<number | null>(null)
  const [lastKnownTime, setLastKnownTime] = useState<number>(0)

  // Force metadata load on component mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    if (videoRef.current) {
      setCurrentWatchStart(videoRef.current.currentTime)
      setLastKnownTime(videoRef.current.currentTime)
    }
  }, [setIsPlaying])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
    if (videoRef.current && currentWatchStart !== null) {
      const endTime = videoRef.current.currentTime
      // Only add interval if we actually played continuously
      if (endTime > currentWatchStart) {
        addInterval(currentWatchStart, endTime)
      }
    }
    setCurrentWatchStart(null)
  }, [currentWatchStart, addInterval, setIsPlaying])

  const handleSeeked = useCallback(() => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime
      
      // If we were playing and tracking, check if this was a seek or natural progression
      if (isPlaying && currentWatchStart !== null) {
        const timeDiff = Math.abs(newTime - lastKnownTime)
        
        // If the time jump is significant (>1 second), it's a seek, not natural playback
        if (timeDiff > 1) {
          // Save the interval we were actually watching before the seek
          addInterval(currentWatchStart, lastKnownTime)
          // Start new tracking from the seeked position
          setCurrentWatchStart(newTime)
        }
        // If it's a small difference, it's just natural video progression
      }
      
      setLastKnownTime(newTime)
    }
  }, [isPlaying, currentWatchStart, lastKnownTime, addInterval])

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime
      updateCurrentTime(newTime)
      
      // Track continuous playback
      if (isPlaying) {
        setLastKnownTime(newTime)
      }
    }
  }, [updateCurrentTime, isPlaying])

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration)
    }
  }, [setDuration])

  const jumpToPosition = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
  {/* Left side: VideoPlayer and IntervalTimeline stacked vertically */}
  <div className="lg:col-span-2 flex flex-col gap-4">
    <VideoPlayer
      videoRef={videoRef}
      onPlay={handlePlay}
      onPause={handlePause}
      onSeeked={handleSeeked}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      currentTime={currentTime}
      duration={duration}
      isPlaying={isPlaying}
    />
    <IntervalTimeline
      intervals={watchedIntervals}
      duration={duration}
      currentTime={currentTime}
    />
  </div>

  {/* Right side: ProgressPanel spans full height of the two components */}
  <div className="lg:row-span-2">
    <ProgressPanel
      progress={currentProgress}
      uniqueWatchedTime={uniqueWatchedTime}
      totalSegments={watchedIntervals.length}
      currentTime={currentTime}
      duration={duration}
    />
  </div>
</div>
        
      
   
      <ControlButtons
        onJumpTo30={() => jumpToPosition(30)}
        onJumpTo120={() => jumpToPosition(120)}
        onReset={resetProgress}
      />
    </div>
  )
}