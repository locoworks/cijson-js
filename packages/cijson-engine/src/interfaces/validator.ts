import type { Context } from "./context";
export type Validator = (config: any, context: any) => Context;
export type ValidatorCollection = Record<string, Validator>;
