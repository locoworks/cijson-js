import { Config, Context } from "../interfaces";
declare const validate: (config: Config, context: Context) => Promise<Context>;
export default validate;
