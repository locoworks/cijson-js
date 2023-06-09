import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import {
  findKeysFromRequest,
  generateRandomKey,
} from "@locoworks/cijson-utils";
import { CanCreateUser } from "@temp/commerce";

const prepare = ({ req }: any) => {
  const payload = findKeysFromRequest(req, ["password"]);
  return payload;
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  try {
    console.log("generateRandomKey", await generateRandomKey());
    return await CanCreateUser(prepareResult);
  } catch (error) {
    throw error;
  }
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
