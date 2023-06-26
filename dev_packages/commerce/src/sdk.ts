import {
  CIJConfig as CIConfig,
  CIJEngine as CIEngine,
} from "@locoworks/cijson-engine";
import timestamps from "./cijson/mixins/timestamps.json";
import users from "./cijson/resources/users.json";

class CommerceSDK {
  private static instance: CommerceSDK;
  private static engine: any;
  private static bcryptSalt: any;

  private constructor() {
    // Private constructor to prevent instantiation outside of this class
  }

  public static getInstance(operator: any, salt: string): CommerceSDK {
    if (!CommerceSDK.instance) {
      CommerceSDK.instance = new CommerceSDK();
      const ciConfig = new CIConfig();
      ciConfig.setBCryptSalt(salt);
      ciConfig.registerMixin("timestamps", timestamps);
      ciConfig.registerResource(users);
      ciConfig.registerOperator(operator);
      const ciEngine = new CIEngine(ciConfig);
      CommerceSDK.engine = ciEngine;
    }
    return CommerceSDK.instance;
  }

  public static getEngine(): any {
    return CommerceSDK.engine;
  }
}

export default CommerceSDK;
