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

    // Real-time subscription - listen to users table
    useEffect(() => {
        const channel = supabase
            .channel('users-channel')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'users' },
                (payload) => refreshUserData()
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'users' },
                (payload) => refreshUserData()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [selectedDate, user, partnerName])

    const refreshUserData = async () => {
        // Load mood:
        const { data: myData } = await supabase
            .from("users")
            .select("*")
            .eq("username", user)
            .single()

        setMyStatus(myData || null)

        // Load partner data:
        const { data: partnerData } = await supabase
            .from("users")
            .select("*")
            .eq("username", partnerName)
            .single()

        setPartnerStatus(partnerData || null)
    }

    const handleUpdateStatus = async (statusData) => {
        // STEP 1 — Insert new history record
        const { error: histError } = await supabase
            .from("mood_history")
            .insert({
                username: user,
                mood: statusData.mood,
                status: statusData.status,
                happylevel: statusData.happyLevel,
                date: selectedDate
            })

        if (histError) console.error('Error inserting history:', histError)

        // STEP 2 — Update current status in users table
        const { error: userError } = await supabase
            .from("users")
            .update({
                mood: statusData.mood,
                status: statusData.status,
                happylevel: statusData.happyLevel,
                date: selectedDate
            })
            .eq("username", user)

        if (userError) console.error('Error updating user status:', userError)

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
                        className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                        title="Logout"
                        style={{ marginTop: '-4px' }}
                    >
                        <LogOut size={22} />
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
