// Run: node lib/drive.test.ts
import assert from 'node:assert'
import { drivePreview, driveDownload } from './drive.ts'

const P = 'https://drive.google.com/file/d/ABC123/preview'
const D = 'https://drive.google.com/uc?export=download&id=ABC123'

assert.equal(drivePreview('https://drive.google.com/file/d/ABC123/view?usp=sharing'), P)
assert.equal(drivePreview('https://drive.google.com/file/d/ABC123/view'), P)
assert.equal(drivePreview('https://drive.google.com/open?id=ABC123'), P)
assert.equal(drivePreview('https://drive.google.com/uc?export=download&id=ABC123'), P)
assert.equal(drivePreview('https://drive.google.com/file/d/ABC123/preview'), P)

assert.equal(driveDownload('https://drive.google.com/file/d/ABC123/view?usp=sharing'), D)
assert.equal(driveDownload('https://drive.google.com/file/d/ABC123/preview'), D)
assert.equal(driveDownload('https://drive.google.com/open?id=ABC123'), D)
assert.equal(driveDownload(D), D)

// Non-Drive links pass through untouched
assert.equal(drivePreview('https://example.com/invoice.pdf'), 'https://example.com/invoice.pdf')
assert.equal(driveDownload('https://example.com/invoice.pdf'), 'https://example.com/invoice.pdf')
assert.equal(drivePreview(''), '')
assert.equal(driveDownload(''), '')

console.log('drive: all checks passed')
