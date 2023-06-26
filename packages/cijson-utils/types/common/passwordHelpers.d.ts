import "fast-text-encoding";
declare function hashPassword(password: string, salt: string): Promise<string>;
declare function validatePassword(password: string, hash: string, salt: string): Promise<boolean>;
export { hashPassword, validatePassword };
