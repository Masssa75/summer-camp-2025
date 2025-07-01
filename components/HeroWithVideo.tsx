'use client';

import BackgroundVideo from './BackgroundVideo';

interface HeroWithVideoProps {
  videoSrc: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaAction?: () => void;
}

export default function HeroWithVideo({
  videoSrc,
  title,
  subtitle,
  ctaText,
  ctaAction
}: HeroWithVideoProps) {
  return (
    <BackgroundVideo
      src={videoSrc}
      overlay={true}
      overlayOpacity={0.4}
      className="h-screen"
    >
      <div className="flex items-center justify-center h-full px-4">
        <div className="text-center text-white max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-200">
              {subtitle}
            </p>
          )}
          {ctaText && (
            <button
              onClick={ctaAction}
              className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all animate-fade-in-up animation-delay-400"
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </BackgroundVideo>
  );
}