// Run: node lib/drive.test.ts
import assert from 'node:assert'
import { drivePreview, driveDownload, driveThumbnail } from './drive.ts'

const P = 'https://drive.google.com/file/d/ABC123/preview'
const D = 'https://drive.usercontent.google.com/download?id=ABC123&export=download&confirm=t'

assert.equal(drivePreview('https://drive.google.com/file/d/ABC123/view?usp=sharing'), P)
assert.equal(drivePreview('https://drive.google.com/file/d/ABC123/view'), P)
assert.equal(drivePreview('https://drive.google.com/open?id=ABC123'), P)
assert.equal(drivePreview('https://drive.google.com/uc?export=download&id=ABC123'), P)
assert.equal(drivePreview('https://drive.google.com/file/d/ABC123/preview'), P)

assert.equal(driveDownload('https://drive.google.com/file/d/ABC123/view?usp=sharing'), D)
assert.equal(driveDownload('https://drive.google.com/file/d/ABC123/preview'), D)
assert.equal(driveDownload('https://drive.google.com/open?id=ABC123'), D)
assert.equal(driveDownload(D), D)
// the legacy uc endpoint must be upgraded, not preserved
assert.equal(driveDownload('https://drive.google.com/uc?export=download&id=ABC123'), D)

// Non-Drive links pass through untouched
assert.equal(drivePreview('https://example.com/invoice.pdf'), 'https://example.com/invoice.pdf')
assert.equal(driveDownload('https://example.com/invoice.pdf'), 'https://example.com/invoice.pdf')
assert.equal(drivePreview(''), '')
assert.equal(driveDownload(''), '')

assert.equal(driveThumbnail('https://drive.google.com/file/d/ABC123/view?usp=sharing'),
  'https://drive.google.com/thumbnail?id=ABC123&sz=w400')
assert.equal(driveThumbnail('https://drive.google.com/open?id=ABC123', 240),
  'https://drive.google.com/thumbnail?id=ABC123&sz=w240')
assert.equal(driveThumbnail('https://example.com/clip.mp4'), '')
assert.equal(driveThumbnail(''), '')

console.log('drive: all checks passed')
