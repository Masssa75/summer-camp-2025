'use client';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export default function VideoPlayer({ 
  src, 
  poster,
  className = '',
  autoPlay = false,
  muted = false,
  loop = false
}: VideoPlayerProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}>
      <video
        controls
        playsInline
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        poster={poster}
        className="w-full h-auto"
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace('.mp4', '.webm')} type="video/webm" />
        Your browser doesn't support HTML5 video.
      </video>
    </div>
  );
}