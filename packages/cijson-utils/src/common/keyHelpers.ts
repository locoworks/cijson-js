/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";

function generateApiKey(apiKeyLength = 16): Promise<string> {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let apiKey = "";
  for (let i = 0; i < apiKeyLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    apiKey += characters.charAt(randomIndex);
  }

  return bcrypt.hash(apiKey, 10);
}

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
  // if (isCloudflareWorkers()) {
  //   return crypto.randomBytes(32).toString("hex");
  // }
  return generateApiKey();
}

export { generateRandomKey, generateApiKey };
