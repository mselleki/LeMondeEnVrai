/**
 * Get flag emoji or fallback to country code display
 * Some browsers/systems don't support flag emojis well
 */
export function getFlagDisplay(flag: string | undefined, countryCode: string): string {
  if (flag) {
    return flag;
  }
  // Fallback: display country code if no flag emoji
  return countryCode;
}

/**
 * Check if flag emoji is supported
 */
export function isFlagEmojiSupported(): boolean {
  if (typeof window === 'undefined') return true;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return true;
  
  canvas.width = 16;
  canvas.height = 16;
  ctx.font = '16px Arial';
  ctx.fillText('🇫🇷', 0, 16);
  
  // Check if the flag was rendered (simple heuristic)
  const imageData = ctx.getImageData(0, 0, 16, 16);
  return imageData.data.some((pixel, index) => index % 4 !== 3 && pixel !== 0);
}
