import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string
const client = new MongoClient(uri)
let cachedClient: MongoClient | null = null

export async function GET() {
  try {
    if (!cachedClient) {
      await client.connect()
      cachedClient = client
    }

    const db = cachedClient.db("video_tracking_db")
    const collection = db.collection("progress")

    const allProgress = await collection.find({}).toArray()

    return NextResponse.json(allProgress, { status: 200 })
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
