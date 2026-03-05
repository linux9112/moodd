export default function PartnerStatus({ data }) {
    if (!data) {
        return (
            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s', minHeight: '180px', display: 'flex', flexDirection: 'column' }}>
                <h2 className="text-xl font-bold mb-4 mt-1 text-white">Friend Status</h2>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-white/60 font-medium">No data for this date</p>
                </div>
            </div>
        )
    }

    return (
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-bold mb-6 mt-1 text-white">Friend Status</h2>

            <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl py-4 px-2 flex flex-col items-center justify-center gap-1 transition-all hover:bg-white/10">
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">Feeling</p>
                    <p className="font-bold text-white text-lg text-center leading-tight">
                        {data.mood || 'Not set'}
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl py-4 px-2 flex flex-col items-center justify-center gap-1 transition-all hover:bg-white/10">
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">Activity</p>
                    <p className="font-bold text-white text-[15px] text-center leading-tight line-clamp-2">
                        {data.status || 'Not set'}
                    </p>
                </div>

                <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 transition-all hover:bg-white/10">
                    <div className="flex justify-between items-center w-full">
                        <p className="text-white/70 text-sm font-semibold flex items-center gap-1.5 tracking-wide">
                            Mood Percentage
                        </p>
                        <span className="font-bold text-white text-lg tracking-wide">
                            {data.happylevel ?? 0}%
                        </span>
                    </div>
                    <div className="w-full bg-black/10 h-2.5 rounded-full overflow-hidden shadow-inner relative">
                        <div
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-300 to-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            style={{ width: `${data.happylevel ?? 0}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
