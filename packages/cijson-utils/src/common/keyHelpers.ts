/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";

function generateApiKey(apiKeyLength = 16, salt: string): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let apiKey = "";
  for (let i = 0; i < apiKeyLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    apiKey += characters.charAt(randomIndex);
  }

  var hash = bcrypt.hashSync(apiKey, salt);
  return hash;
}

async function generateRandomKey(apiKeyLength = 16, salt: string) {
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
  return generateApiKey(apiKeyLength, salt);
}

export { generateRandomKey, generateApiKey };
