#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Video optimization script for summer camp videos
const optimizeVideo = (inputPath, outputPath, options = {}) => {
  const {
    width = 1920,
    height = 1080,
    quality = 28,
    removeAudio = true,
    duration = null,
  } = options;

  let command = `ffmpeg -i "${inputPath}"`;
  
  // Set video codec and quality
  command += ` -c:v libx264 -crf ${quality} -preset fast`;
  
  // Set resolution
  command += ` -vf scale=${width}:${height}`;
  
  // Handle audio
  if (removeAudio) {
    command += ' -an';
  } else {
    command += ' -c:a aac -b:a 128k';
  }
  
  // Set duration if specified
  if (duration) {
    command += ` -t ${duration}`;
  }
  
  // Web optimization flags
  command += ' -movflags +faststart';
  
  // Output file
  command += ` "${outputPath}"`;
  
  return new Promise((resolve, reject) => {
    console.log(`Optimizing video: ${inputPath}`);
    console.log(`Command: ${command}`);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      console.log(`✓ Video optimized: ${outputPath}`);
      resolve(outputPath);
    });
  });
};

// Batch process multiple videos
const processVideos = async () => {
  const videosDir = path.join(process.cwd(), 'public', 'videos', 'raw');
  const outputDir = path.join(process.cwd(), 'public', 'videos', 'optimized');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Define optimization settings for different video types
  const videoConfigs = [
    {
      input: 'hero-raw.mp4',
      output: 'hero.mp4',
      options: { width: 1920, height: 1080, quality: 26, duration: 15 }
    },
    {
      input: 'hero-raw.mp4',
      output: 'hero-mobile.mp4',
      options: { width: 854, height: 480, quality: 30, duration: 15 }
    },
    {
      input: 'swimming-raw.mp4',
      output: 'swimming.mp4',
      options: { width: 1280, height: 720, quality: 28, duration: 10 }
    },
    {
      input: 'nature-raw.mp4',
      output: 'nature.mp4',
      options: { width: 1280, height: 720, quality: 28, duration: 10 }
    },
    {
      input: 'arts-raw.mp4',
      output: 'arts.mp4',
      options: { width: 1280, height: 720, quality: 28, duration: 10 }
    },
    {
      input: 'sports-raw.mp4',
      output: 'sports.mp4',
      options: { width: 1280, height: 720, quality: 28, duration: 10 }
    }
  ];
  
  // Process each video
  for (const config of videoConfigs) {
    const inputPath = path.join(videosDir, config.input);
    const outputPath = path.join(outputDir, config.output);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${config.input} - file not found`);
      continue;
    }
    
    try {
      await optimizeVideo(inputPath, outputPath, config.options);
      
      // Get file sizes for comparison
      const inputSize = fs.statSync(inputPath).size / (1024 * 1024);
      const outputSize = fs.statSync(outputPath).size / (1024 * 1024);
      const reduction = ((inputSize - outputSize) / inputSize * 100).toFixed(1);
      
      console.log(`   Original: ${inputSize.toFixed(1)}MB → Optimized: ${outputSize.toFixed(1)}MB (${reduction}% reduction)`);
    } catch (error) {
      console.error(`Failed to process ${config.input}:`, error);
    }
  }
};

// Run if called directly
if (require.main === module) {
  // Check if ffmpeg is installed
  exec('ffmpeg -version', (error) => {
    if (error) {
      console.error('❌ FFmpeg not found. Please install FFmpeg first:');
      console.error('   macOS: brew install ffmpeg');
      console.error('   Ubuntu: sudo apt install ffmpeg');
      console.error('   Windows: Download from ffmpeg.org');
      process.exit(1);
    }
    
    // Process command line arguments
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      // Batch process
      processVideos().catch(console.error);
    } else if (args.length >= 2) {
      // Single file
      const [input, output] = args;
      const options = {
        width: args[2] || 1920,
        height: args[3] || 1080,
        quality: args[4] || 28,
      };
      optimizeVideo(input, output, options).catch(console.error);
    } else {
      console.log('Usage:');
      console.log('  Batch process: node optimize-video.js');
      console.log('  Single file:   node optimize-video.js input.mp4 output.mp4 [width] [height] [quality]');
    }
  });
}

module.exports = { optimizeVideo };