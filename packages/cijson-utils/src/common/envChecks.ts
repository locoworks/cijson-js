/* eslint-disable @typescript-eslint/no-explicit-any */
declare const caches: any;

export function isNodeJS() {
  if (
    typeof process === "object" &&
    typeof process.versions === "object" &&
    typeof process.versions.node !== "undefined"
  ) {
    return true;
  } else {
    return false;
  }

  // Alternative
  // https://github.com/vimeo/player.js/blob/9692b256ca59bb39b2971dc4e25b04bdc84a1136/src/lib/functions.js#L10
  // if (typeof process !== "undefined" && process.release.name === "node") {
  //   return true;
  // } else {
  //   return false;
  // }
}

export function isCloudflareWorkers() {
  return typeof caches !== "undefined" && typeof caches.default !== "undefined";
}
