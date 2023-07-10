import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import { pickKeysFromObject, generateRandomKey } from "@locoworks/cijson-utils";
import CommerceSDK from "../../../sdk";

const prepare = (executionContext: any) => {
  return pickKeysFromObject(executionContext, ["email", "password"]);
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  const cie = CommerceSDK.getEngine();

  // const secretKey = await generateRandomKey(16, cie.config.bcryptSalt);

  // console.log("secretKey", secretKey);

  prepareResult["tenant_id"] = "default";
  const createdUser: any = await cie.create("users", {
    payload: prepareResult,
    transformations: ["pick_first"],
  });

  return createdUser;
};

const respond = ({ handleResult }: StoryExecutionContext) => {
  return handleResult;
};

export default {
  prepare,
  authorize,
  handle,
  respond,
};
