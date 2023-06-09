import "fast-text-encoding";
declare function hashPassword(password: string): Promise<string>;
declare function validatePassword(password: string, hash: string): Promise<boolean>;
export { hashPassword, validatePassword };
