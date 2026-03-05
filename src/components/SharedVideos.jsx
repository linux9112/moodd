import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { ExternalLink } from 'lucide-react'

export default function SharedVideos({ currentUser, selectedDate }) {
    const [url, setUrl] = useState('')
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        refreshVideos()
    }, [selectedDate])

    // Real-time listener for video additions
    useEffect(() => {
        const channel = supabase
            .channel('videos-channel')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'videos' }, (payload) => {
                refreshVideos()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [selectedDate])

    const refreshVideos = async () => {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('date', selectedDate)
            .order('id', { ascending: false })

        if (!error && data) {
            setVideos(data)
        }
    }

    const handleAddVideo = async (e) => {
        e.preventDefault()
        if (!url) return

        setLoading(true)

        // User expressly requested explicitly this payload for videos
        const { error } = await supabase
            .from('videos')
            .insert({
                url: url,
                addedby: currentUser,
                date: selectedDate
            })

        if (error) {
            console.error('Error adding video:', error)
            alert('Failed to add video')
        } else {
            setUrl('')
            refreshVideos()
        }
        setLoading(false)
    }

    return (
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.3s', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
            <h2 className="text-xl font-bold mb-5 mt-1 text-white">
                Shared Videos
            </h2>

            <form onSubmit={handleAddVideo} className="mb-6 flex flex-col gap-3">
                <input
                    type="url"
                    placeholder="Paste video link here..."
                    className="glass-input m-0 w-full"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="glass-btn !w-full pt-3 pb-3"
                >
                    {loading ? 'Adding...' : 'Add Video'}
                </button>
            </form>

            <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1 stylish-scrollbar flex-1 justify-center">
                {videos.length === 0 ? (
                    <div className="text-center text-white/60 font-medium">
                        No videos shared for this date
                    </div>
                ) : (
                    videos.map((vid) => (
                        <a
                            key={vid.id || vid.url + Date.now()}
                            href={vid.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/20 transition-colors flex flex-col gap-1 group block relative"
                        >
                            <div className="font-semibold text-sm text-white flex items-center justify-between">
                                <span>{vid.addedBy} shared</span>
                                <span className="text-xs text-white/60 font-normal">{vid.date}</span>
                            </div>
                            <div className="text-blue-200 text-xs truncate underline w-full pr-6">
                                {vid.url}
                            </div>
                            <ExternalLink size={14} className="absolute right-3 top-1/2 flex -translate-y-1/2 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    ))
                )}
            </div>

            {/* Scrollbar CSS */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .stylish-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .stylish-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
        }
        .stylish-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .stylish-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}} />
        </div>
    )
}
