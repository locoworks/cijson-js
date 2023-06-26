// eslint-disable-next-line @typescript-eslint/no-explicit-any
import "fast-text-encoding";

import bcrypt from "bcryptjs";

async function hashPassword(password: string, salt: string) {
  var hash = bcrypt.hashSync(password, salt);
  return hash;
}

async function validatePassword(password: string, hash: string, salt: string) {
  const hashedPassword = await hashPassword(password, salt);
  return hash === hashedPassword;
}

export { hashPassword, validatePassword };
