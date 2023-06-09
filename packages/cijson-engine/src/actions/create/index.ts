// const getOperations = require("../helpers/getOperations");
// const runOperations = require("../helpers/runOperations");
// const fillBelongsToOneResources = require("../helpers/fillBelongsToOneResources");
// const fillHasOneResources = require("../helpers/fillHasOneResources");
// const fillHasManyResources = require("../helpers/fillHasManyResources");
// const fillHasManyWithPivotResources = require("../helpers/fillHasManyWithPivotResources");
// const runTransformationsForFilters = require("../helpers/runTransformationsForFilters");
// const authorize = require("../helpers/authorize");
// const executeSequence = require("../helpers/executeSequence");
// const enhanceWithHooks = require("../helpers/enhanceWithHooks");
// const cleanPayload = require("../helpers/cleanPayload");
// const runTransformations = require("../helpers/runTransformations");
// const saveFacet = require("../helpers/saveFacet");
// const generateFacets = require("../helpers/generateFacets");

import generate from "../../generators";
import { Config, Context } from "../../interfaces";
import authorize from "../../utils/authorize";
import cleanPayload from "../../utils/cleanPayload";
import enhanceWithHooks from "../../utils/enhanceWithHooks";
import executeSequence from "../../utils/executeSequence";
import runOperations from "../../utils/runOperations";
import validate from "../../validators";
import generateOperations from "./generateOperations";

const CreateAction = async (config: Config, context: Context) => {
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

  // console.log("context", config.resources["users"]);

  context = await executeSequence(config, context, sequence);

  return context;
};

export default CreateAction;
