'use client';

import BackgroundVideo from './BackgroundVideo';

interface VideoSectionProps {
  videoSrc: string;
  height?: string;
  position?: 'fixed' | 'relative';
  children?: React.ReactNode;
}

export default function VideoSection({
  videoSrc,
  height = 'h-96',
  position = 'relative',
  children
}: VideoSectionProps) {
  return (
    <section className={position === 'fixed' ? 'relative' : ''}>
      {position === 'fixed' && (
        <div className="fixed inset-0 -z-10">
          <BackgroundVideo
            src={videoSrc}
            overlay={true}
            overlayOpacity={0.7}
            className="h-full"
          />
        </div>
      )}
      
      {position === 'relative' && (
        <BackgroundVideo
          src={videoSrc}
          overlay={true}
          overlayOpacity={0.3}
          className={height}
        >
          {children}
        </BackgroundVideo>
      )}

      {position === 'fixed' && children}
    </section>
  );
}