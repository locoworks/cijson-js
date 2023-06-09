import { pathToRegexp } from "path-to-regexp";
// import { UserCanAuthorize, KeysRecognize } from "@locoworks/access-sdk";

const exclude = [
  "GET /health",
  "POST /users/register",
  "POST /users/login",
  "POST /users/verify-registration",
  "POST /users/request-reset-password",
  "POST /users/reset-password",
  "POST /admins/register",
  "POST /admins/login",
  "GET /openapi/(.*)",
  "GET /openapi",
];

const authMiddleware = async (req: any, reply: any) => {};

export default authMiddleware;
