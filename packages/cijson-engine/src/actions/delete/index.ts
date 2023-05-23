import generate from "../../generators";
import { Config, Context } from "../../interfaces";
import authorize from "../../utils/authorize";
import cleanPayload from "../../utils/cleanPayload";
import enhanceWithHooks from "../../utils/enhanceWithHooks";
import executeSequence from "../../utils/executeSequence";
import runOperations from "../../utils/runOperations";
import validate from "../../validators";
import generateOperations from "./generateOperations";

const DeleteAction = async (config: Config, context: Context) => {
  const sequence = await enhanceWithHooks(config, context, {
    prepare: [cleanPayload, generate],
    authorize: [authorize],
    validate: [validate],
    handle: [
      //   runTransformationsForFilters,
      generateOperations,
      runOperations,
      //   fillBelongsToOneResources,
      //   fillHasOneResources,
      //   fillHasManyResources,
      //   fillHasManyWithPivotResources,
      //   runTransformations,
    ],
    // respond: [generateFacets],
  });

  context = await executeSequence(config, context, sequence);

  return context;
};

export default DeleteAction;
