// eslint-disable-next-line @typescript-eslint/no-explicit-any
import "fast-text-encoding";
import bcrypt from "bcrypt";

async function hashPassword(password: string) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function validatePassword(password: string, hash: string) {
  const hashedPassword = await hashPassword(password);
  return hash === hashedPassword;
}

export { hashPassword, validatePassword };
