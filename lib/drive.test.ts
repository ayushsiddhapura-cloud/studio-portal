// Run: node lib/drive.test.ts
import assert from 'node:assert'
import { drivePreview } from './drive.ts'

const P = 'https://drive.google.com/file/d/ABC123/preview'

assert.equal(drivePreview('https://drive.google.com/file/d/ABC123/view?usp=sharing'), P)
assert.equal(drivePreview('https://drive.google.com/file/d/ABC123/view'), P)
assert.equal(drivePreview('https://drive.google.com/open?id=ABC123'), P)
assert.equal(drivePreview('https://drive.google.com/uc?export=download&id=ABC123'), P)
assert.equal(drivePreview('https://drive.google.com/file/d/ABC123/preview'), P)

// Non-Drive links pass through untouched
assert.equal(drivePreview('https://example.com/invoice.pdf'), 'https://example.com/invoice.pdf')
assert.equal(drivePreview(''), '')

console.log('drivePreview: all checks passed')
