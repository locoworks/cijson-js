import Fastify from "fastify";
import * as Sentry from "@sentry/node";

const setErrorHandler = (error: any, request: any, reply: any) => {
  console.log("error", error);

  if (error.statusCode) {
    reply.status(error.statusCode).send(error);
  }

  if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
    if (
      process.env.SENTRY_DSN !== "" &&
      process.env.SENTRY_ENV !== "development"
    ) {
      Sentry.captureException(error);
      reply.status(500).send({ ok: false });
    } else {
      reply.status(500).send(error);
    }
  } else {
    reply.send(error);
  }
};

export default setErrorHandler;
