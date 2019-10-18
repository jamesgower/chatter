import express, { Response, Request } from "express";

const path = require("path");

const app = express();

require("./sockets")(app);

if (process.env.NODE_ENV === "production") {
  const publicPath = path.join(__dirname, "../dist");

  app.use(express.static(publicPath));

  app.get("*", (req: Request, res: Response): void => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}
