# Mood Connect - Developer Handoff Document

This document contains the complete project specification, prompts, and architecture of the "Friend Mood" (formerly "Mood Connect") web application. It is designed to be fed to another AI assistant to immediately understand the context, UI design, and database integration of the current codebase.

## 1. Project Overview & Tech Stack
**Goal:** Build a modern, mobile-first web app where two predefined friends ("Dindayal" and "Lakshmi") can share their mood, activity status, happy level, and favorite videos in real time.
**Frontend:** React (Vite template), plain CSS (Glassmorphism design, no Tailwind)
**Backend / Database:** Supabase (PostgreSQL)
**Realtime Engine:** Supabase Realtime Subscriptions (`postgres_changes`)
**Deployment:** Currently running locally via `npm run dev`

## 2. Design Aesthetic (Glassmorphism & Mobile-First)
The user provided specific visual mockups which have been perfectly matched in `src/index.css`:
- **Background:** Flat soft blue background (`#74a8ff` to `#85b8ff`).
- **Cards/Inputs:** Frosted glassmorphism UI. `rgba(255, 255, 255, 0.22)` backgrounds with `blur(12px)`.
- **Layout:** Centered mobile-first container constrained to `max-width: 420px`.
- **Buttons:** Solid white buttons with blue text, no gradients.
- **Typography:** Inter/system-ui. Title is "Friend Mood", subtitle is "Share your feelings with your friends".

## 3. Core Features & Components

### A. Authentication (`Login.jsx`)
- Strictly manual login using text inputs for Username and Password.
- No demo credentials displayed on the UI.
- Hardcoded accepted credentials: 
  - User 1: `Dindayal` / `Dindayal`
  - User 2: `Lakshmi` / `Lakshmi`
- State is held in the main `App.jsx` component. Uses `sessionStorage` strictly for the auth token to preserve reloads (no mood data saved in local storage).

### B. Dashboard Panel (`Dashboard.jsx`)
- Displays greeting ("Hi, [User]! Share your mood with [Partner]").
- Native HTML date picker to select the current or a past date. Defaults to today.
- Acts as the parent state manager fetching data for the chosen date and subscribing to real-time events.

### C. My Status (`MyStatus.jsx`)
- **Mood:** 10 distinct Emoji buttons (Happy, Sad, Angry, Confused, Excited, Romantic, Missing You, Tired, Stressed, Chill). Selected emoji scales up and highlights.
- **Activity:** 6 specific activities arranged in a 2-column pill grid (Free, Busy, Studying, Bahar hu, Charging, Sleeping).
- **Happy Level:** Smooth CSS range slider from 0% to 100%. Custom white slider thumb.
- **Action:** "Update My Status" button commits these three values to the database for the selected date.

### D. Friend Status (`PartnerStatus.jsx`)
- A read-only mirror of the `MyStatus` card.
- If no data exists for the partner on the chosen date, it shows a clean zero-state: "No data for this date".

### E. Shared Videos (`SharedVideos.jsx`)
- Input field to paste a video URL.
- "Add Video" button commits to the database.
- A vertically scrolling feed displays all links submitted on the selected date showing who added it (e.g., "Lakshmi shared").
- "No videos shared for this date" zero-state when empty.

## 4. Supabase Database Schema

All data interactions occur directly with Supabase. Below are the exact table definitions currently used in production. Note that fields are strictly lowercase.

### Table: `mood_history`
Used to store historical and daily moods. Does not overwrite previous days.
- `id` (uuid, primary key)
- `username` (text: 'Dindayal' or 'Lakshmi')
- `mood` (text: The selected emoji label)
- `status` (text: The selected activity)
- `happylevel` (integer: 0-100)
- `date` (date/text: formatted as 'YYYY-MM-DD')
- `created_at` (timestamp)

### Table: `videos`
- `id` (uuid, primary key)
- `url` (text)
- `addedby` (text: 'Dindayal' or 'Lakshmi')
- `date` (date/text: formatted as 'YYYY-MM-DD')

## 5. Exact Supabase Query Logic (CRITICAL)
The application has been strictly refactored to execute the following queries exact to the user's specification.

### Saving User Status (Insert Only)
When "Update My Status" is clicked, it ALWAYS inserts a new row into `mood_history` to preserve a timeline.
```javascript
const { error } = await supabase
    .from("mood_history")
    .insert({
        username: currentUser,
        mood: selectedMood,
        status: selectedStatus,
        happylevel: happyLevel, // NOTE: lowercase
        date: selectedDate
    })
```

### Loading Status Data
When switching dates or loading, it grabs the **single most recent** row for that specific day.
```javascript
const { data } = await supabase
    .from("mood_history")
    .select("*")
    .eq("username", currentUser) // (or partnerName)
    .eq("date", selectedDate)
    .order("id", { ascending: false }) // OR "created_at"
    .limit(1)
    .single()
```

### Shared Videos logic
```javascript
// Insert
await supabase.from("videos").insert({ url: videoLink, addedby: currentUser, date: selectedDate })

// Load
await supabase.from("videos").select("*").eq("date", selectedDate).order("id", { ascending: false })
```

### Realtime Subscriptions
The `Dashboard` sets up a channel listener mapping to the exact tables to instantly trigger a React re-render when the partner presses update.
```javascript
supabase
    .channel('mood-history-channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mood_history' }, () => refreshUserData())
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'mood_history' }, () => refreshUserData())
    .subscribe()
```
