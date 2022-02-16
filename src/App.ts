import express from "express";

export default class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
  }

  initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded());
  }

  public listen(port: any) {
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }
}
