import type { Config, Context } from "../interfaces";

const runOperations = async (config: Config, context: Context) => {
  const { operations } = context;
  const actionResult = await config.operator.run(operations || []);
  context.actionResult = actionResult;
  return context;
};

export default runOperations;
