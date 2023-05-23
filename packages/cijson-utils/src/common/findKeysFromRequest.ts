/* eslint-disable @typescript-eslint/no-explicit-any */
// generate function to pick keys from object
const findKeysFromRequest = (req: any, attributes: any) => {
  const result: any = {};
  // debugLogger(req.body, req.params, req.query, attributes);

  for (const attribute of attributes) {
    if (req.body && (req.body[attribute] || req.body[attribute] === false)) {
      result[attribute] = req.body[attribute];
    }
    if (
      req.params &&
      (req.params[attribute] || req.params[attribute] === false)
    ) {
      result[attribute] = req.params[attribute];
    }
    if (req.query && (req.query[attribute] || req.query[attribute] === false)) {
      result[attribute] = req.query[attribute];
    }
  }

  return result;
};

export default findKeysFromRequest;
