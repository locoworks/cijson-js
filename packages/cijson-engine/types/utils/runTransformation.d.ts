import type { Config, Context } from "../interfaces";
declare const runTransformation: (config: Config, context: Context, valueFromSource: any, transformation: any) => Promise<any>;
export default runTransformation;
