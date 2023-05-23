/* eslint-disable @typescript-eslint/no-explicit-any */
// generate function to pick keys from object
const pickKeysFromObject = (obj: any, keys: string[]) => {
  return keys.reduce((acc: any, key: string) => {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

export default pickKeysFromObject;
