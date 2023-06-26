declare function generateApiKey(apiKeyLength: number | undefined, salt: string): string;
declare function generateRandomKey(apiKeyLength: number | undefined, salt: string): Promise<string>;
export { generateRandomKey, generateApiKey };
