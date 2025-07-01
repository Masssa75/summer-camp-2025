'use client';

interface VideoEmbedProps {
  platform: 'youtube' | 'instagram' | 'vimeo';
  videoId: string;
  title?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
}

export default function VideoEmbed({ 
  platform, 
  videoId, 
  title = 'Embedded video',
  aspectRatio = '16:9' 
}: VideoEmbedProps) {
  const aspectRatioClasses = {
    '16:9': 'pb-[56.25%]',
    '9:16': 'pb-[177.78%]',
    '1:1': 'pb-[100%]'
  };

  const getEmbedUrl = () => {
    switch (platform) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoId}`;
      case 'instagram':
        // Instagram requires the full post URL
        return `https://www.instagram.com/p/${videoId}/embed`;
    }
  };

  return (
    <div className="w-full">
      <div className={`relative ${aspectRatioClasses[aspectRatio]} overflow-hidden rounded-lg bg-gray-100`}>
        <iframe
          src={getEmbedUrl()}
          title={title}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}