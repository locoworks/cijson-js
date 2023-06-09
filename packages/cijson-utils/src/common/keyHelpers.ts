/* eslint-disable @typescript-eslint/no-explicit-any */
import { isCloudflareWorkers, isNodeJS } from "./envChecks";
// import crypto from "crypto";
declare const crypto: any;

async function generateRandomKey() {
  // if (isNodeJS()) {
  //   //     const secret = new TextEncoder().encode(
  //   // crypto.randomBytes(32).toString("hex")
  //   //     );
  //   //     const alg = "HS256";

  //   //     const jwt2 = await new jose.SignJWT({})
  //   //       .setProtectedHeader({ alg })
  //   //       .setAudience("account")
  //   //       .sign(secret);

  //   //     console.log(jwt2);

  //   const ncrypto = await import("crypto");
  //   return ncrypto.randomBytes(32).toString("hex");
  // }

  if (isCloudflareWorkers()) {
    return crypto.randomBytes(32).toString("hex");
  }
}

export { generateRandomKey };
