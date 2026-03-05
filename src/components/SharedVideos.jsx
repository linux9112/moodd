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

            <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2 stylish-scrollbar flex-1 pb-2">
                {videos.length === 0 ? (
                    <div className="text-center text-white/60 font-medium py-10 bg-white/5 rounded-2xl border border-white/10">
                        No videos shared for this date
                    </div>
                ) : (
                    videos.map((vid) => (
                        <a
                            key={vid.id || vid.url + Date.now()}
                            href={vid.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl border border-white/20 transition-all flex flex-col gap-2 group relative overflow-hidden backdrop-blur-md shadow-sm hover:shadow-md"
                            style={{ textDecoration: 'none', wordBreak: 'break-all' }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-sm text-white flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center text-xs shadow-sm text-white shrink-0">
                                        {(vid.addedby || 'U').charAt(0).toUpperCase()}
                                    </span>
                                    {vid.addedby || 'Someone'} shared
                                </span>
                                <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider bg-black/20 px-2.5 py-1 rounded-full shrink-0">{vid.date}</span>
                            </div>

                            <div className="bg-black/20 rounded-xl p-3 border border-white/5 group-hover:bg-black/30 transition-colors flex items-center gap-3">
                                <div className="bg-blue-500/20 p-2 rounded-lg shrink-0">
                                    <ExternalLink size={16} className="text-blue-300" />
                                </div>
                                <div className="text-blue-100 text-sm font-medium overflow-hidden w-full">
                                    <p className="truncate w-full">{vid.url}</p>
                                </div>
                            </div>
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
