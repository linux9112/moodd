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

export default function PartnerStatus({ data }) {
    if (!data) {
        return (
            <div className="glass-card animate-fade-in pb-8" style={{ animationDelay: '0.2s', minHeight: '180px', display: 'flex', flexDirection: 'column' }}>
                <h2 className="text-2xl font-bold mb-6 mt-1 text-white">Friend Status</h2>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-white/60 font-medium opacity-70">No data for this date</p>
                </div>
            </div>
        )
    }

    const currentMood = MOODS.find(m => m.label === data.mood) || { emoji: '😶', label: data.mood || 'Not set' };
    const currentActivity = ACTIVITIES.find(a => a.value === data.status) || { icon: '❓', label: data.status || 'Not set' };

    return (
        <div className="glass-card animate-fade-in pb-8" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold mb-6 mt-1 text-white">Friend Status</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '1.2rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <p className="text-white text-xs font-semibold uppercase mb-2 opacity-80" style={{ letterSpacing: '0.05em' }}>Feeling</p>
                    <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{currentMood.emoji}</span>
                    <span className="font-bold text-white text-lg text-center">{currentMood.label}</span>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '1.2rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <p className="text-white text-xs font-semibold uppercase mb-2 opacity-80" style={{ letterSpacing: '0.05em' }}>Activity</p>
                    <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{currentActivity.icon}</span>
                    <span className="font-bold text-white text-lg text-center" style={{ fontSize: '1.05rem' }}>{currentActivity.label}</span>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2 px-1">
                    <label className="text-sm font-semibold text-white flex gap-1 items-center">
                        Mood Percentage
                    </label>
                    <span className="font-bold text-white text-lg">
                        {data.happylevel ?? 0}%
                    </span>
                </div>
                <div className="slider-container px-1">
                    <div className="slider-track-fill" style={{ width: `${data.happylevel ?? 0}%` }}></div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={data.happylevel ?? 0}
                        readOnly
                        disabled
                        className="glass-slider"
                        style={{ opacity: 0.8, cursor: 'default' }}
                    />
                </div>
            </div>
        </div>
    )
}
