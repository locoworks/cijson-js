import Fastify from "fastify";
import errorHandler from "./http/errorHandler";
import notFoundHandler from "./http/notFoundHandler";
import corsMiddleware from "./http/corsMiddleware";
import authMiddleware from "./http/authMiddleware";
import loadEndpoints from "../endpoints";

const rootPrefix = process.env.API_ROOT_PREFIX || "";

const startServer = () => {
  const app = Fastify({
    rewriteUrl(req) {
      if (!req.url) {
        return "";
      }

      if (rootPrefix) {
        return req.url.replace(new RegExp(`^${rootPrefix}`), "");
      }

      return req.url;
    },
  });
  app.register(require("@fastify/formbody"));
  app.setErrorHandler(errorHandler);
  app.setNotFoundHandler(notFoundHandler);
  app.addHook("onRequest", corsMiddleware);
  app.addHook("onRequest", authMiddleware);
  loadEndpoints(app);
  return app;
};

export default startServer;
