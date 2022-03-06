import { RequestHandler, Router } from "express";
import prisma from "../db";
import UserService from "../services/user.service";

export default class UserController {
  static confirmUser: RequestHandler = async (req, res) => {
    let { userId } = req.body;
    prisma.user.update({
      where: { id: userId },
      data: {
        confirmed: true,
        enabled: true,
      },
    });
    res.sendStatus(200);
  };
  static enableUser: RequestHandler = async (req, res) => {
    let { userId } = req.body;
    prisma.user.update({
      where: { id: userId },
      data: {
        enabled: true,
      },
    });
    res.sendStatus(200);
  };
  static disableUser: RequestHandler = async (req, res) => {
    let { userId } = req.body;
    prisma.user.update({
      where: { id: userId },
      data: {
        enabled: false,
      },
    });
    res.sendStatus(200);
  };
  static grantPermission: RequestHandler = async (req, res) => {
    let { userId, permission } = req.body;
    await UserService.grantPermission(userId, permission);
    res.sendStatus(200);
  };
  static denyPermission: RequestHandler = async (req, res) => {
    let { userId, permission } = req.body;
    await UserService.denyPermission(userId, permission);
    res.sendStatus(200);
  };

  static getUsers: RequestHandler = async (req, res) => {
    let users = await prisma.user.findMany();
    res.send(users);
  };

  static getUserById: RequestHandler = async (req, res) => {
    let { userId } = req.body;
    let user = await prisma.user.findUnique({ where: { id: userId } });
    res.send(user);
  };

  static setup() {
    let router = Router();
    router.post("/confirm", this.confirmUser);
    router.post("/enable", this.enableUser);
    router.post("/disable", this.disableUser);
    router.post("/grant", this.grantPermission);
    router.post("/deny", this.denyPermission);
    router.post("/all", this.getUsers);
    router.post("/single", this.getUserById);
    return router;
  }
  static route = "/user";
}
