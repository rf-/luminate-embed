export function log(message) {
  if (window.console && window.console.log) {
    console.log(`[luminate-embed] ${message}`)
  }
}
