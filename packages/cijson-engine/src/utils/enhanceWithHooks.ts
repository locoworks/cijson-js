import type { Config, Context, Hook } from "../interfaces";

function humanize(str: string, delim: string) {
  const frags = str.split(delim);
  for (let i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join("");
}

function capitalizeFirstLetter(text: string) {
  text = humanize(text, "_");
  text = humanize(text, "-");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// type FunctionArray = Array<() => Context>;

const enhanceWithHooks = async (
  config: Config,
  context: Context,
  actionSequence: any
) => {
  // const { locoAction, resourceModels, locoConfig } = context;
  const lifeCycles = ["before", "after"];
  const methods = ["prepare", "authorize", "validate", "handle", "respond"];
  // let excludeMethods = <string>[];

  // if (locoAction["stopAfterPhase"] !== undefined) {
  // 	if (locoAction["stopAfterPhase"] === "validate") {
  // 		excludeMethods = ["handle", "respond"];
  // 	}
  // }

  let hooks: Array<Hook> = [];

  methods.forEach((method) => {
    // console.log("actionSequence", actionSequence[method]);

    // 	if (excludeMethods.includes(method)) {
    // 		return;
    // 	}

    lifeCycles.forEach((lifeCycle) => {
      const hookName = `${lifeCycle}${capitalizeFirstLetter(
        method
      )}${capitalizeFirstLetter(context.action)}${capitalizeFirstLetter(
        context.resourceName
      )}`;

      if (config.hooks[hookName]) {
        hooks.push(config.hooks[hookName]);
      }

      if (lifeCycle === "before") {
        const actionFuncs = actionSequence[method];
        if (actionFuncs !== undefined && actionFuncs.length > 0) {
          hooks = [...hooks, ...actionFuncs];
        }
      }
    });
  });

  return hooks;
};

export default enhanceWithHooks;
