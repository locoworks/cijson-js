import CommerceSDK from "./sdk";
import { pahrStrategy } from "@locoworks/cijson-utils";

import CanCreateUserStory from "./stories/Users/CanCreate";

const CanCreateUser = async (args: any) => {
  let result = await pahrStrategy(CanCreateUserStory, args);
  return result["respondResult"];
};

export { CommerceSDK, CanCreateUser };
