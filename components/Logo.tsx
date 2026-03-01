export default function Logo() {
    return (
        <div className="flex items-center gap-2 group">
            {/* The A Emblem */}
            <div className="relative w-9 h-9 flex items-center justify-center bg-[#1a1a26] rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-[#ffffff14] overflow-hidden group-hover:scale-110 group-hover:border-[var(--accent)] transition-all duration-300">
                {/* Glow behind the A */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-[#ff8a00] opacity-20 group-hover:opacity-40 transition-opacity" />

                <svg className="w-5 h-5 text-[var(--accent)] z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 22h3.5l2.5-5h8l2.5 5H22L12 2zm-2.5 11.5L12 6.5l2.5 7h-5z" />
                </svg>

                {/* Bottom Accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--accent)] rounded-b-xl transform translate-y-1 group-hover:translate-y-0 transition-transform" />
            </div>

            {/* Text Mark */}
            <div className="flex flex-col justify-center leading-none">
                <span className="text-[18px] font-black tracking-tighter text-white">
                    Ani<span className="text-[var(--accent)]">Pocket</span>
                </span>
                <span className="text-[10px] font-medium tracking-[0.2em] text-[#888] uppercase hidden sm:block group-hover:text-white transition-colors">
                    Anime Streaming
                </span>
            </div>
        </div>
    );
}
