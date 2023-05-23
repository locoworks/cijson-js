/* eslint-disable @typescript-eslint/no-explicit-any */
function resolveByDot(path: string, obj: Record<string, any>) {
  const value = path.split(".").reduce(function (prev, curr) {
    return prev ? prev[curr] : null;
  }, obj);

  return value !== null && value !== undefined ? value : undefined;
}

function setByDot(
  path: string,
  obj: Record<string, any>,
  value: Record<string, any>
) {
  let schema = obj; // a moving reference to internal objects within obj
  const pList = path.split(".");
  const len = pList.length;
  for (let i = 0; i < len - 1; i++) {
    const elem = pList[i];
    if (!schema[elem]) {
      schema[elem] = {};
    }
    schema = schema[elem];
  }

  schema[pList[len - 1]] = value;
}

// function setByDot(obj, path, val) {
//   path.split(".").reduce(function (prev, curr, _idx, _arr) {
//     if (_idx === _arr.length - 1 && prev) {
//       prev[curr] = val;
//     }

//     return prev ? prev[curr] : null;
//   }, obj);

//   return obj;
// }

export { resolveByDot, setByDot };
