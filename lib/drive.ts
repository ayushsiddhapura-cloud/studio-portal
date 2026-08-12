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

// Raw bytes for a Drive file — used both as the <video> source and by download
// links. Must be the usercontent host: the older drive.google.com/uc endpoint
// answers with a "virus scan warning" HTML page for larger files, which a
// <video> cannot play. This one returns the real stream and honours range
// requests, so seeking works. Non-Drive URLs pass through.
export function driveDownload(url: string) {
  if (!url) return url
  const id = driveId(url)
  return id ? `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t` : url
}

