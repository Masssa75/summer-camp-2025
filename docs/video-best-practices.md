# Video Best Practices for Summer Camp Website

## 🎯 Quick Start Checklist

- [ ] Videos are under 10MB each
- [ ] Videos are muted for autoplay
- [ ] Poster images are provided
- [ ] Mobile versions are created
- [ ] Videos loop seamlessly
- [ ] Tested on real devices

## 📹 Video Specifications

### Hero/Background Videos
- **Resolution**: 1920x1080 (desktop), 854x480 (mobile)
- **Format**: MP4 (H.264 codec)
- **Frame rate**: 24-30 fps
- **Duration**: 10-15 seconds (looped)
- **File size**: 5-10MB (desktop), 2-3MB (mobile)
- **Audio**: None (removed for smaller files)

### Activity Preview Videos
- **Resolution**: 1280x720
- **Duration**: 5-10 seconds
- **File size**: 2-3MB
- **Purpose**: Hover effects, small previews

## 🛠 Preparation Workflow

### 1. Record/Source Videos
**Good subjects for camp videos:**
- Kids playing and laughing
- Swimming pool activities
- Arts and crafts close-ups
- Sports activities
- Nature walks
- Campfire scenes
- Group activities

**Tips for filming:**
- Use a tripod for stable shots
- Film during golden hour (sunrise/sunset)
- Capture genuine moments, not staged
- Get signed media releases from parents

### 2. Edit Videos
**Using Free Tools:**

**iMovie (Mac)**:
1. Import video
2. Trim to 10-15 seconds
3. Add subtle color correction
4. Export as 1080p MP4

**DaVinci Resolve (Free, All platforms)**:
1. Create 1920x1080 project
2. Import and trim clips
3. Apply color grading
4. Export with H.264 codec

**Online Tools**:
- Canva (free tier available)
- Kapwing (watermark on free tier)
- ClipChamp (Microsoft, free basic)

### 3. Optimize for Web

**Quick optimization script** (save as `optimize.sh`):
```bash
#!/bin/bash
# Desktop version
ffmpeg -i input.mp4 -c:v libx264 -crf 26 -preset fast -an \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  -movflags +faststart desktop.mp4

# Mobile version
ffmpeg -i input.mp4 -c:v libx264 -crf 30 -preset fast -an \
  -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2" \
  -movflags +faststart mobile.mp4

# Generate poster image
ffmpeg -i input.mp4 -vf "scale=1920:1080" -frames:v 1 poster.jpg
```

## 🎨 Design Considerations

### Creating Seamless Loops
1. **Film extra footage** at beginning and end
2. **Crossfade technique**:
   ```bash
   # Create seamless loop with 1-second crossfade
   ffmpeg -i input.mp4 -filter_complex \
     "[0:v]split[body][pre]; \
     [pre]trim=duration=1,setpts=PTS-STARTPTS[jt]; \
     [body]trim=start=1,setpts=PTS-STARTPTS[main]; \
     [main][jt]overlay=enable='gte(t,9)':shortest=1" \
     -t 10 -an seamless-loop.mp4
   ```

### Overlay Text Visibility
- Use 40-60% black overlay for white text
- Avoid busy backgrounds for important text
- Test readability on mobile devices

## 🚀 Performance Optimization

### Loading Strategy
```tsx
// Progressive enhancement approach
const CampHero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  return (
    <div className="relative h-screen">
      {/* 1. Low-quality placeholder image (loads immediately) */}
      <img 
        src="/images/hero-placeholder.jpg" 
        className="absolute inset-0 w-full h-full object-cover blur-sm"
      />
      
      {/* 2. High-quality poster (loads next) */}
      <img 
        src="/images/hero-poster.jpg" 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* 3. Video (loads last) */}
      <LazyBackgroundVideo
        src="/videos/hero.mp4"
        mobileSrc="/videos/hero-mobile.mp4"
        onLoad={() => setVideoLoaded(true)}
      />
    </div>
  );
};
```

### Bandwidth Detection
```tsx
// Respect user's data preferences
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
};

// Usage
const HeroSection = () => {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <StaticHeroImage />;
  }
  
  return <VideoHero />;
};
```

## 📱 Mobile Considerations

### iOS Safari Autoplay Requirements
- Video MUST be muted
- Video MUST have `playsInline` attribute
- User interaction not required if muted

### Android Performance
- Some older Android devices struggle with video
- Provide `poster` attribute as fallback
- Consider disabling on Android < 8.0

### Data Usage Warning
```tsx
const VideoWithWarning = () => {
  const [userConsent, setUserConsent] = useState(false);
  const [isOnCellular, setIsOnCellular] = useState(false);
  
  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection?.type === 'cellular') {
      setIsOnCellular(true);
    }
  }, []);
  
  if (isOnCellular && !userConsent) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p>This page contains background videos. Load on cellular data?</p>
        <button onClick={() => setUserConsent(true)}>
          Load Videos
        </button>
      </div>
    );
  }
  
  return <BackgroundVideo src="/videos/hero.mp4" />;
};
```

## 🔍 Testing Videos

### Browser Testing Priority
1. **iOS Safari** (most restrictive)
2. **Chrome Mobile**
3. **Desktop Chrome/Firefox**
4. **Samsung Internet**

### Performance Metrics
Use Chrome DevTools:
1. Network tab → Slow 3G throttling
2. Check video loads < 3 seconds
3. Verify no layout shift
4. Total page weight < 10MB

### Accessibility Testing
- Ensure no essential info in video only
- Provide text alternatives
- Test with screen readers
- Respect prefers-reduced-motion

## 💡 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Video won't autoplay | Ensure muted + playsInline attributes |
| Black bars on video | Use CSS object-fit: cover |
| Choppy playback | Reduce resolution or bitrate |
| Long load times | Create smaller mobile version |
| Loop has gap | Use crossfade technique above |

## 🎬 Example Implementation

Full hero section with all best practices:

```tsx
const OptimizedHero = () => {
  return (
    <LazyBackgroundVideo
      src="https://cdn.example.com/videos/hero-desktop.mp4"
      mobileSrc="https://cdn.example.com/videos/hero-mobile.mp4"
      poster="/images/hero-poster.jpg"
      overlay={true}
      overlayOpacity={0.4}
      className="h-screen"
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">
            Summer Camp 2025
          </h1>
          <p className="text-2xl mb-8">
            Where Adventures Begin
          </p>
          <button className="btn-primary">
            Register Now
          </button>
        </div>
      </div>
    </LazyBackgroundVideo>
  );
};
```