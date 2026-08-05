function driveId(url: string) {
  return url.match(/\/d\/([^/?#]+)/)?.[1] || url.match(/[?&]id=([^&#]+)/)?.[1]
}

// Turns a Google Drive share link into its embeddable /preview form.
// Non-Drive URLs are returned unchanged so an <iframe> can still try them.
export function drivePreview(url: string) {
  if (!url) return url
  const id = driveId(url)
  return id ? `https://drive.google.com/file/d/${id}/preview` : url
}

// Direct-download form of a Drive link. Non-Drive URLs pass through.
export function driveDownload(url: string) {
  if (!url) return url
  const id = driveId(url)
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url
}
