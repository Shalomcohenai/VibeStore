#!/usr/bin/env node

/**
 * Image optimization script for VibeStore
 * Optimizes images in img/ directory for production
 */

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...');

  try {
    // Optimize images in img/ directory
    const files = await imagemin(['img/**/*.{jpg,jpeg,png}'], {
      destination: 'img/optimized',
      plugins: [
        imageminMozjpeg({
          quality: 85,
          progressive: true
        }),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    });

    // Create WebP versions
    const webpFiles = await imagemin(['img/**/*.{jpg,jpeg,png}'], {
      destination: 'img/webp',
      plugins: [
        imageminWebp({
          quality: 80
        })
      ]
    });

    console.log(`✅ Optimized ${files.length} images`);
    console.log(`✅ Created ${webpFiles.length} WebP versions`);
    console.log('📁 Optimized images saved to img/optimized/');
    console.log('📁 WebP images saved to img/webp/');

  } catch (error) {
    console.error('❌ Error optimizing images:', error);
    process.exit(1);
  }
}

// Run optimization
optimizeImages();
