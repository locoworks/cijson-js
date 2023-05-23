import { Config, Context } from "../../interfaces";
declare const ReadAction: (config: Config, context: Context) => Promise<Context>;
export default ReadAction;
