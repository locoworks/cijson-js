import { Config, Context } from "../interfaces";
declare const validator: (config: Config, context: Context, constraints: any) => Promise<unknown>;
export default validator;
