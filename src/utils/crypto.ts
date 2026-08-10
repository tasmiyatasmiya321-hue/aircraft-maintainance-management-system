/**
 * Utility for password hashing and verification using Web Crypto API (SHA-256).
 */

export async function hashPassword(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyPassword(plainText: string, expectedHash: string): Promise<boolean> {
  if (!plainText || !expectedHash) return false;
  const computedHash = await hashPassword(plainText);
  return computedHash.toLowerCase() === expectedHash.toLowerCase();
}

/**
 * Synchronous hash check fallback for pre-computed hashes or fast checks.
 */
export function hashPasswordSync(plainText: string): string {
  // Simple deterministic hash fallback for instant validation if crypto API is delayed
  let hash = 0;
  for (let i = 0; i < plainText.length; i++) {
    const char = plainText.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'amms_hash_' + Math.abs(hash).toString(16);
}
