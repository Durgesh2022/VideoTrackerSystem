import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string
const client = new MongoClient(uri)

export async function POST(request: Request) {
  try {
    const { userId, videoId, intervals, mergedMap } = await request.json()

    if (!userId || !videoId || !Array.isArray(intervals)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 })
    }

    if (!client.isConnected?.()) await client.connect()
    const db = client.db("video_tracking_db")
    const collection = db.collection("progress")

    await collection.updateOne(
      { videoId },
      {
        $set: {
          userId,
          intervals,
          mergedMap,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ message: "Progress saved" }, { status: 200 })
  } catch (error) {
    console.error("Error saving video progress:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
