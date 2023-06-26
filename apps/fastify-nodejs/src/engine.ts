import { KnexJSOperator } from "@locoworks/cijson-operator-knexjs";
import { knexInstance } from "@infra/database";
import { CommerceSDK } from "@temp/commerce";

const operator = new KnexJSOperator();
operator.setInstance(knexInstance);
const commerceInstance = CommerceSDK.getInstance(
  operator,
  process.env.BCRYPT_SALT
);
// commerceInstance.setBcryptSalt(process.env.BCRYPT_SALT);
export { commerceInstance };
