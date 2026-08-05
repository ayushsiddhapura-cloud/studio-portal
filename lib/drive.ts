// Turns a Google Drive share link into its embeddable /preview form.
// Non-Drive URLs are returned unchanged so an <iframe> can still try them.
export function drivePreview(url: string) {
  if (!url) return url
  const id = url.match(/\/d\/([^/?#]+)/)?.[1] || url.match(/[?&]id=([^&#]+)/)?.[1]
  return id ? `https://drive.google.com/file/d/${id}/preview` : url
}
