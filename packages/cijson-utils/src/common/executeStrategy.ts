/* eslint-disable @typescript-eslint/no-explicit-any */
export interface StoryExecutionContext {
  prepareResult?: any;
  authorizeResult?: any;
  handleResult?: any;
  respondResult?: any;
}

const checkMissingFunctions = (
  handlerFunctions: string[] = [],
  shouldInclude: string[] = []
) => {
  const collectErrors: string[] = [];

  if (handlerFunctions.length > 0) {
    shouldInclude.forEach((f: string) => {
      if (!handlerFunctions.includes(f) && f.charAt(0) !== "*") {
        collectErrors.push(f);
      }
    });
  }

  return collectErrors;
};

const executeStrategy = (sequence: string[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (story: any, ...args: any) => {
    const context = {
      ...story,
    };

    const handlerFunctions = Object.keys(context);
    const missingFunctions = checkMissingFunctions(handlerFunctions, sequence);

    if (!missingFunctions.length) {
      // console.log("exxx---->", args);

      const executionContext = Object.assign(
        {
          storyName: story,
        },
        ...args
      );

      // console.log("exxx---->", executionContext);

      try {
        for (let ord of sequence) {
          if (ord.charAt(0) === "*") {
            ord = ord.substring(1);
            if (!context[ord]) {
              continue;
            }
          }

          executionContext[`${ord}Result`] = await context[ord].apply(null, [
            executionContext,
          ]);
        }

        return executionContext;
      } catch (error) {
        console.log("Error in excuteStrategy function", error);
        throw error;
      }
    } else {
      throw {
        statusCode: 500,
        message: "Missing Functions or Files",
        missingFunctions,
      };
    }
  };
};

const pahrStrategy = executeStrategy([
  "prepare",
  "authorize",
  "handle",
  "respond",
]);

export { executeStrategy, pahrStrategy };
