import { pahrStrategy } from "@locoworks/cijson-utils";

const prepareStoryContext = (req: any, res: any, next: any) => {
  return {
    req,
    res,
    next,
    reqBody: req.body,
    reqParams: req.params,
    reqQuery: req.query,
    reqHeaders: req.Headers,
  };
};

const loadEndpoints = (app: any) => {
  app.get("/health", async (request: any, res: any) => {
    return res.code(200).send({
      status: "evoilve Is Healthy",
      version: "1.0.17",
      ip: request.ip,
      userAgent: request.headers["user-agent"],
    });
  });

  /**
   * Todo: Aim for naming consistency, we used Fetch, Retrieve, Read for same meaning
   */

  const endpoints = [];

  for (let index = 0; index < endpoints.length; index++) {
    const endpoint: any = endpoints[index];

    app[endpoint[0]](endpoint[1], async (req: any, res: any, next: any) => {
      let result = await pahrStrategy(
        endpoint[2],
        prepareStoryContext(req, res, next)
      );

      return res.code(200).send(result["respondResult"]);
    });
  }

  //   app.get("/authorize", async (req: any, res: any, next: any) => {
  //     let result = await pahrStrategy(
  //       Authorize,
  //       prepareStoryContext(req, res, next)
  //     );
  //     return res.code(200).send(result["respondResult"]);
  //   });

  //   app.post("/register", async (req: any, res: any, next: any) => {
  //     let result = await pahrStrategy(
  //       Register,
  //       prepareStoryContext(req, res, next)
  //     );
  //     return res.code(200).send(result["respondResult"]);
  //   });
};

export default loadEndpoints;
