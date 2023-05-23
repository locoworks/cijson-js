import type { Context } from "./context";
export type Hook = (config: any, context: any) => Context;
export type HookCollection = Record<string, Hook>;
