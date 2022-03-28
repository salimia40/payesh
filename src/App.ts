import express from "express";
import boom from "express-boom";
import { threadId } from "worker_threads";
import AuthController from "./controllers/auth.controller";
import CityController from "./controllers/city.controller";
import { ContactController } from "./controllers/contact.controller";
import { PictureController } from "./controllers/picture.controller";
import { PropertyController } from "./controllers/property.controller";
import RegionController from "./controllers/region.controller";
import UserController from "./controllers/user.controller";

export default class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeControllers();
  }

  initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(boom());
  }

  initializeControllers() {
    this.app.use(AuthController.route, AuthController.setup());
    this.app.use(UserController.route, UserController.setup());
    this.app.use(CityController.route, CityController.setup());
    this.app.use(RegionController.route, RegionController.setup());
    this.app.use(PictureController.route, PictureController.setup());
    this.app.use(PropertyController.route, PropertyController.setup());
    this.app.use(ContactController.route, ContactController.setup());
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }
}
