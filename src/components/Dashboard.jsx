import { useState, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import MyStatus from './MyStatus'
import PartnerStatus from './PartnerStatus'
import SharedVideos from './SharedVideos'
import { supabase } from '../supabaseClient'

export default function Dashboard({ user, onLogout }) {
    const partnerName = user === 'Dindayal' ? 'Lakshmi' : 'Dindayal'

    const today = new Date().toISOString().split('T')[0]
    const [selectedDate, setSelectedDate] = useState(today)

    const [myStatus, setMyStatus] = useState(null)
    const [partnerStatus, setPartnerStatus] = useState(null)

    // Fetch initial data
    useEffect(() => {
        refreshUserData()
    }, [selectedDate, user, partnerName])

    // Ask for browser notification permission
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission()
        }
    }, [])

    const showNotification = (message) => {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Friend Update", {
                body: message,
                icon: "/icon.png"
            });
        }
    }

    // Real-time subscription
    useEffect(() => {
        const handleStatusChange = (payload) => {
            if (payload.new && payload.new.username && payload.new.username !== user) {
                const shortName = payload.new.username === 'Lakshmi' ? 'L' : 'D';
                const pronoun = payload.new.username === 'Lakshmi' ? 'her' : 'his';
                showNotification(`🔔 ${shortName} changed ${pronoun} mood`);
            }
            refreshUserData()
        }

        const handleVideoChange = (payload) => {
            if (payload.new && payload.new.addedby && payload.new.addedby !== user) {
                const shortName = payload.new.addedby === 'Lakshmi' ? 'L' : 'D';
                showNotification(`🔔 ${shortName} shared a video`);
            }
        }

        const channel = supabase
            .channel('realtime-updates')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mood_history' }, handleStatusChange)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'mood_history' }, handleStatusChange)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'videos' }, handleVideoChange)
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [selectedDate, user, partnerName])

    const refreshUserData = async () => {
        // Load mood:
        const { data: myData } = await supabase
            .from("mood_history")
            .select("*")
            .eq("username", user)
            .eq("date", selectedDate)
            .order("id", { ascending: false })
            .limit(1)

        setMyStatus(myData?.[0] || null)

        // Load partner data:
        const { data: partnerData } = await supabase
            .from("mood_history")
            .select("*")
            .eq("username", partnerName)
            .eq("date", selectedDate)
            .order("id", { ascending: false })
            .limit(1)

        setPartnerStatus(partnerData?.[0] || null)
    }

    const handleUpdateStatus = async (statusData) => {
        const { data: existingData, error: checkError } = await supabase
            .from("mood_history")
            .select("id")
            .eq("username", user)
            .eq("date", selectedDate)
            .limit(1)

        if (checkError) {
            console.error('Error checking history:', checkError)
            return
        }

        if (existingData && existingData.length > 0) {
            const { error: updateError } = await supabase
                .from("mood_history")
                .update({
                    mood: statusData.mood,
                    status: statusData.status,
                    happylevel: statusData.happyLevel
                })
                .eq("username", user)
                .eq("date", selectedDate)

            if (updateError) console.error('Error updating history:', updateError)
        } else {
            const { error: insertError } = await supabase
                .from("mood_history")
                .insert({
                    username: user,
                    mood: statusData.mood,
                    status: statusData.status,
                    happylevel: statusData.happyLevel,
                    date: selectedDate
                })

            if (insertError) console.error('Error inserting history:', insertError)
        }

        // Refresh to show newly mutated state locally just in case real-time has latency
        refreshUserData()
    }

    return (
        <div className="w-full animate-fade-in relative pb-10">
            <header className="mb-6 flex flex-col pt-2">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            Hi, {user}!
                        </h1>
                        <p className="text-white/90 text-sm font-medium">
                            Share your mood with {partnerName} 👋
                        </p>
                    </div>
                    <button
                        onClick={onLogout}
                        title="Logout"
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '0.6rem',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: 0,
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        <LogOut size={20} />
                    </button>
                </div>

                <div className="w-full pl-1">
                    <label className="block text-white text-sm font-semibold mb-2">Select Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={today}
                        className="glass-input glass-input-date m-0 w-full font-medium"
                    />
                </div>
            </header>

            <div className="flex flex-col gap-4">
                <MyStatus
                    initialData={myStatus}
                    onUpdate={handleUpdateStatus}
                />

                <PartnerStatus
                    data={partnerStatus}
                />

                <SharedVideos
                    currentUser={user}
                    selectedDate={selectedDate}
                />
            </div>

            <p className="text-white/70 text-xs font-medium text-center mt-6 content-end">Made by Motuu for Motki</p>
        </div>
    )
}
