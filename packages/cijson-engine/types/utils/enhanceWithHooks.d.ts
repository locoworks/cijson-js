import type { Config, Context, Hook } from "../interfaces";
declare const enhanceWithHooks: (config: Config, context: Context, actionSequence: any) => Promise<Hook[]>;
export default enhanceWithHooks;
