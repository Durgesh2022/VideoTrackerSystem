

# 🎥 **Video Tracking System**

A full-stack video progress tracking app using **Next.js (App Router)**, **MongoDB**, and **Clerk Authentication**. It tracks **only unique watched intervals**, supports jumping and resetting, and includes an **admin panel** to review user engagement.

---

## ✨ **Features**

```txt
- ✅ Play/Pause video functionality
- ✅ Real-time progress percentage
- ✅ Tracks only unique time intervals (no duplication)
- ✅ Merges overlapping segments
- ✅ Interactive timeline view
- ✅ Jump 30s / Jump 2m buttons
- ✅ Reset tracking functionality
- ✅ Smooth animated progress bar
- ✅ Admin panel for viewing user video segments


---

🛠 Tech Stack

- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Database: MongoDB
- Auth: Clerk.dev
- Language: TypeScript


---

🔐 Authentication

- Users must be signed in using Clerk to track progress
- Each user’s data is saved based on:
  - userId (Clerk ID)
  - videoId (unique for each video)


---

🧠 Backend Functionality

- API Route: /api/setProgress
  - Saves unique time segments to MongoDB
  - Merges overlapping or adjacent segments

- API Route: /api/getProgress
  - Retrieves saved segments for a user/video

- Segment Format:
  {
    userId: string,
    videoId: string,
    segments: [{ start: number, end: number }]
  }

- Segment Merging:
  - Combines overlapping or continuous intervals
  - Ensures clean and accurate progress data


---

📦 Database Schema (MongoDB)

          {
            "userId": "user_12345",
            "videoId": "video_abc",
            "intervals": [
              {
                "start": 0,
                "end": 30,
                "segment": 1
              },
              {
                "start": 90,
                "end": 120,
                "segment": 2
              }
            ],
            "mergedMap": [
              {
                "fromSegments": [1],
                "mergedInto": 1
              },
              {
                "fromSegments": [2],
                "mergedInto": 2
              }
            ],
            "updatedAt": {
              "$date": {
                "$numberLong": "1748112780490"
              }
            }
          }



---

📁 Folder Structure

├── page.tsx                         # Home video player page
├── components/
│   ├── VideoPlayer.tsx             # Video component
│   ├── ProgressPanel.tsx           # Visual stats
│   ├── IntervalTimeline.tsx        # Visual timeline of segments
│   ├── ControlButtons.tsx          # Jump/reset controls
│   ├── VideoProgressTracker.tsx    # Main video logic wrapper
│   └── useVideoProgress.ts         # Custom hook for tracking logic
├── app/
│   ├── api/
│   │   ├── getProgress/page.ts     # Fetch saved segments
│       └── setProgress/page.ts     # Save new segments
├── admin/page.tsx              # Admin dashboard for all segments
├── sign-in/page.tsx            # Clerk Sign In
├── sign-out/page.tsx           # Clerk Sign Out
├── types/
│   └── video.ts                    # Type definitions


---

🧪 Running Locally

# 1. Clone the repository
git clone https://github.com/yourusername/video-tracking-system.git
cd video-tracking-system

# 2. Install dependencies
npm install

# 3. Setup Environment Variables
# Create a .env.local file with the following:

MONGODB_URI=your_mongodb_connection
CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api

# 4. Run development server
npm run dev

# Visit: http://localhost:3000


---

🔐 Admin Access

- Visit /admin to view all segments
- Requires authentication via Clerk
- Admin dashboard displays saved user-video data


---

📸 Screenshots (Coming Soon)

- Video player with tracking overlay
- Timeline showing segments
- Admin panel listing all user segments


---

🙌 Acknowledgements

- Clerk – Authentication
- MongoDB – Database
- Next.js – App framework
- Tailwind CSS – Styling


---

📬 Contact

Built with ❤️ by Durgesh Tiwari

Let me know if you’d like me to export this as an actual `README.md` file or include screenshots/assets as well!
