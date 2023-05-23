import { Config, Context } from "../interfaces";
declare const generate: (config: Config, context: Context) => Promise<Context>;
export default generate;
