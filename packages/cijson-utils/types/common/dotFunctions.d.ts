declare function resolveByDot(path: string, obj: Record<string, any>): Record<string, any> | undefined;
declare function setByDot(path: string, obj: Record<string, any>, value: Record<string, any>): void;
export { resolveByDot, setByDot };
