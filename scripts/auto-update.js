#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let isUpdating = false;

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function checkForChanges() {
  try {
    // Check if there are any uncommitted changes
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim() && !isUpdating) {
      isUpdating = true;
      log('Changes detected, starting auto-update...');
      
      // Add all changes
      execSync('git add -A');
      
      // Create commit with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const commitMessage = `auto: update ${timestamp}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;
      
      execSync(`git commit -m "${commitMessage}"`);
      
      // Push to origin
      execSync('git push origin main');
      
      log('Changes pushed successfully!');
      
      // Wait for Netlify deployment
      log('Waiting 120 seconds for Netlify deployment...');
      setTimeout(() => {
        log('Deployment should be complete.');
        isUpdating = false;
      }, 120000);
      
    }
  } catch (error) {
    log(`Error during auto-update: ${error.message}`);
    isUpdating = false;
  }
}

// Watch for file changes
const chokidar = require('chokidar');

// Watch these directories for changes
const watchPaths = [
  'app/**/*',
  'components/**/*',
  'public/**/*',
  'styles/**/*'
];

log('Starting auto-update watcher...');

const watcher = chokidar.watch(watchPaths, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true
});

watcher
  .on('change', (path) => {
    log(`File changed: ${path}`);
    setTimeout(checkForChanges, 2000); // Debounce for 2 seconds
  })
  .on('add', (path) => {
    log(`File added: ${path}`);
    setTimeout(checkForChanges, 2000);
  })
  .on('unlink', (path) => {
    log(`File removed: ${path}`);
    setTimeout(checkForChanges, 2000);
  });

log('Auto-update watcher started. Monitoring for changes...');

// Keep the process running
process.on('SIGINT', () => {
  log('Auto-update watcher stopped.');
  process.exit(0);
});