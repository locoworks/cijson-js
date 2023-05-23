import type { Config, Context } from "../interfaces";
declare const executeSequence: (config: Config, context: Context, sequence: any[]) => Promise<Context>;
export default executeSequence;
