import "fast-text-encoding";

import { webcrypto } from "crypto";

import { isCloudflareWorkers, isNodeJS } from "./envChecks";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const crypto: any;

async function hashPassword(password: string) {
  if (isNodeJS()) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await webcrypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  }

  if (isCloudflareWorkers()) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  }
}

async function validatePassword(password: string, hash: string) {
  const hashedPassword = await hashPassword(password);
  return hash === hashedPassword;
}

export { hashPassword, validatePassword };
