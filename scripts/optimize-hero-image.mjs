#!/usr/bin/env node
/**
 * Optimizes hero image: creates WebP (primary) and compressed PNG (fallback).
 * Run before build: npm run optimize-images
 */
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const src = path.join(root, 'attached_assets', 'Untitled_design_(18)_1770122157577.png')
const outDir = path.join(root, 'client', 'public', 'attached_assets')

if (!fs.existsSync(src)) {
  console.warn('Hero image not found, skipping optimization:', src)
  process.exit(0)
}

fs.mkdirSync(outDir, { recursive: true })

const webpPath = path.join(outDir, 'jelena-hero.webp')
const pngPath = path.join(outDir, 'jelena-hero.png')

async function run() {
  const pipeline = sharp(src)
    .resize(840, 1050, { fit: 'inside', withoutEnlargement: true })

  await pipeline
    .webp({ quality: 80 })
    .toFile(webpPath)

  await sharp(src)
    .resize(840, 1050, { fit: 'inside', withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(pngPath)

  const webpStat = fs.statSync(webpPath)
  const pngStat = fs.statSync(pngPath)
  console.log('Hero image optimized:')
  console.log('  WebP:', (webpStat.size / 1024).toFixed(1), 'KiB')
  console.log('  PNG:', (pngStat.size / 1024).toFixed(1), 'KiB')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
