import { crypto } from 'jsr:@std/crypto';
import { encodeHex } from 'jsr:@std/encoding/hex';

export async function getFileHash(filePath: string) {
  const file = await Deno.open(filePath, { read: true });
  const readableStream = file.readable;
  const fileHashBuffer = await crypto.subtle.digest('SHA-256', readableStream);

  try {
    file.close();
  } catch {
    //
  }

  return encodeHex(fileHashBuffer);
}
