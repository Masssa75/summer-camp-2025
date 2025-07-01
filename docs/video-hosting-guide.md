# Video Hosting Guide for Summer Camp Website

## Quick Setup Options

### Option 1: Cloudinary (Easiest)

1. **Sign up** at cloudinary.com (free tier includes 25GB)

2. **Upload your video**:
```javascript
// Install: npm install cloudinary
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret'
});

// Upload and get optimized URL
const result = await cloudinary.uploader.upload('camp-hero.mp4', {
  resource_type: 'video',
  folder: 'summer-camp',
  transformation: [
    { width: 1920, height: 1080, crop: 'limit' },
    { quality: 'auto' },
    { format: 'mp4' }
  ]
});

console.log(result.secure_url);
```

3. **Use in your component**:
```tsx
<BackgroundVideo 
  src="https://res.cloudinary.com/your-cloud/video/upload/v123/summer-camp/camp-hero.mp4"
/>
```

### Option 2: Direct Upload to Vercel/Netlify

For videos under 20MB:

1. **Add to public folder**:
```
public/
  videos/
    hero-video.mp4
    swimming-activity.mp4
```

2. **Reference directly**:
```tsx
<BackgroundVideo src="/videos/hero-video.mp4" />
```

### Option 3: YouTube Private/Unlisted

1. **Upload as unlisted**
2. **Get direct MP4 URL** using youtube-dl:
```bash
youtube-dl -f 'best[ext=mp4]' --get-url https://youtube.com/watch?v=VIDEO_ID
```

3. **Note**: This method may break if YouTube changes their system

## Video Optimization Commands

### Using FFmpeg (Free, powerful)

```bash
# Basic optimization (reduces file size by ~70%)
ffmpeg -i original.mp4 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k output.mp4

# Create mobile version (smaller file)
ffmpeg -i original.mp4 -vf scale=854:480 -c:v libx264 -crf 30 mobile.mp4

# Remove audio (for background videos)
ffmpeg -i original.mp4 -c:v copy -an silent.mp4

# Create a 10-second loop
ffmpeg -i original.mp4 -t 10 -loop 1 loop.mp4
```

### Using HandBrake (GUI tool)

1. Download from handbrake.fr
2. Use "Web Optimized" preset
3. Set quality to 28-30 (lower quality = smaller file)
4. Enable "Web Optimized" checkbox

## Cost Comparison

| Service | Free Tier | Paid | Best For |
|---------|-----------|------|----------|
| Cloudinary | 25GB bandwidth/month | $99/month for 225GB | Auto-optimization |
| Bunny CDN | None | $0.01/GB | High traffic |
| AWS S3+CloudFront | 5GB storage, 1GB transfer | ~$0.09/GB | Scale |
| Vercel | 100GB bandwidth | $20/month per member | Small videos |
| Netlify | 100GB bandwidth | $19/month per member | Small videos |

## Recommended Setup for Summer Camp

1. **Hero Videos** (homepage backgrounds):
   - Host on Cloudinary
   - 1080p, 10-15 seconds, loop
   - ~5-8MB per video

2. **Activity Previews** (hover effects):
   - Host on Vercel/Netlify
   - 720p, 5-10 seconds
   - ~2-3MB per video

3. **Testimonial Backgrounds**:
   - Static image with CSS animation
   - Or very short (5 sec) subtle video

## Implementation Example

```tsx
// utils/videos.ts
const VIDEO_URLS = {
  hero: process.env.NODE_ENV === 'production' 
    ? 'https://res.cloudinary.com/camp/video/upload/q_auto/hero.mp4'
    : '/videos/hero-local.mp4',
    
  swimming: 'https://res.cloudinary.com/camp/video/upload/w_720,q_auto/swimming.mp4',
  // ... more videos
};

// components/OptimizedVideo.tsx
export function OptimizedVideo({ type }: { type: keyof typeof VIDEO_URLS }) {
  const [quality, setQuality] = useState('auto');
  
  useEffect(() => {
    // Detect connection speed
    const connection = (navigator as any).connection;
    if (connection?.effectiveType === '4g') {
      setQuality('1080p');
    } else if (connection?.effectiveType === '3g') {
      setQuality('720p');
    } else {
      setQuality('480p');
    }
  }, []);
  
  return (
    <BackgroundVideo 
      src={VIDEO_URLS[type].replace('q_auto', `q_${quality}`)}
    />
  );
}
```

## Testing Checklist

- [ ] Test on slow 3G connection
- [ ] Verify autoplay works on iOS Safari
- [ ] Check total page weight < 10MB
- [ ] Ensure videos loop seamlessly
- [ ] Test with JavaScript disabled (show poster)
- [ ] Verify accessibility (no essential info in video only)