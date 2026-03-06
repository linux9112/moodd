import { useState, useEffect } from 'react'

const MOODS = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '😕', label: 'Confused' },
    { emoji: '🤩', label: 'Excited' },
    { emoji: '❤️', label: 'Romantic' },
    { emoji: '🥺', label: 'Missing You' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '😣', label: 'Stressed' },
    { emoji: '😎', label: 'Chill' }
]

const ACTIVITIES = [
    { value: '🟢 Free', label: 'Free', icon: '🟢' },
    { value: '🔴 Busy', label: 'Busy', icon: '🔴' },
    { value: '📚 Studying', label: 'Studying', icon: '📚' },
    { value: '🚶 Bahar hu', label: 'Bahar hu', icon: '🚶' },
    {
        value: '📱 Phone', label: 'Phone', icon: '📱'
    },
    { value: '💤 Sleeping', label: 'Sleeping', icon: '💤' }
]

export default function MyStatus({ initialData, onUpdate }) {
    const [mood, setMood] = useState(initialData?.mood || '')
    const [status, setStatus] = useState(initialData?.status || '🟢 Free')
    const [happyLevel, setHappyLevel] = useState(initialData?.happylevel ?? 50)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        if (initialData) {
            setMood(initialData.mood || '')
            setStatus(initialData.status || '🟢 Free')
            setHappyLevel(initialData.happylevel ?? 50)
        } else {
            setMood('')
            setStatus('🟢 Free')
            setHappyLevel(50)
        }
    }, [initialData])

    const handleUpdate = async () => {
        setUpdating(true)
        await onUpdate({ mood, status, happyLevel })
        setUpdating(false)
    }

    return (
        <div className="glass-card animate-fade-in pb-8" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold mb-6 mt-1">My Status</h2>

            {/* Mood Selection */}
            <div className="mb-8">
                <label className="block text-white text-md font-semibold mb-5">How are you feeling?</label>
                <div className="emoji-grid">
                    {MOODS.map(m => (
                        <button
                            key={m.label}
                            onClick={() => setMood(m.label)}
                            className={`emoji-btn ${mood === m.label ? 'active' : ''}`}
                        >
                            <span className="emoji-icon">{m.emoji}</span>
                            <span className="emoji-label">{m.label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Activity Status */}
            <div className="mb-8">
                <label className="block text-white text-md font-semibold mb-4">What are you doing?</label>
                <div className="pills-grid">
                    {ACTIVITIES.map(a => (
                        <button
                            key={a.value}
                            onClick={() => setStatus(a.value)}
                            className={`pill-btn ${status === a.value ? 'active' : ''}`}
                        >
                            <span className="text-xs">{a.icon}</span>
                            <span>{a.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Happy Level Slider */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-2 px-1">
                    <label className="text-sm font-semibold text-white flex gap-1 items-center">
                        Mood Percentage
                    </label>
                    <span className="font-bold text-white text-lg">
                        {happyLevel}%
                    </span>
                </div>
                <div className="slider-container px-1">
                    <div className="slider-track-fill" style={{ width: `${happyLevel}%` }}></div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={happyLevel}
                        onChange={(e) => setHappyLevel(parseInt(e.target.value))}
                        className="glass-slider"
                    />
                </div>
            </div>

            <button
                onClick={handleUpdate}
                disabled={updating}
                className="glass-btn mt-6"
            >
                {updating ? 'Updating...' : 'Update My Status'}
            </button>
        </div>
    )
}
