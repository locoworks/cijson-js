declare function generateApiKey(apiKeyLength?: number): Promise<string>;
declare function generateRandomKey(): Promise<string>;
export { generateRandomKey, generateApiKey };
