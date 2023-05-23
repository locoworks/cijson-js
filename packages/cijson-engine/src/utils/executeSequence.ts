import type { Config, Context } from "../interfaces";

const executeSequence = async (
  config: Config,
  context: Context,
  sequence: any[]
) => {
  for (const fn of sequence) {
    context = await fn.apply(null, [config, context]);
  }
  return context;
};

export default executeSequence;
