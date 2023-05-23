import type { Config, Context } from "../interfaces";
declare const runOperations: (config: Config, context: Context) => Promise<Context>;
export default runOperations;
