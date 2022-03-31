import { RequestHandler, Router } from "express";
import prisma from "../db";
import authMiddleware from "../middlewares/auth.middleware";
import permissionMiddleware from "../middlewares/permission.middleware";
import UserService from "../services/user.service";
import { permissionValidator, userIdValidator } from "./validators";

export default class UserController {
  static confirmUser: RequestHandler = async (req, res) => {
    let { userId } = req.body;
    await prisma.user.update({
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
    await prisma.user.update({
      where: { id: userId },
      data: {
        enabled: true,
      },
    });
    res.sendStatus(200);
  };
  static disableUser: RequestHandler = async (req, res) => {
    let { userId } = req.body;
    await prisma.user.update({
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
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: { permissions: true },
    });
    res.send(user);
  };

  static setup() {
    let router = Router();
    router.post(
      "/confirm",
      authMiddleware,
      permissionMiddleware("userVerification", true),
      userIdValidator,
      this.confirmUser
    );
    router.post(
      "/enable",
      authMiddleware,
      permissionMiddleware("suspendUsers", true),
      userIdValidator,
      this.enableUser
    );
    router.post(
      "/disable",
      authMiddleware,
      permissionMiddleware("suspendUsers", true),
      userIdValidator,
      this.disableUser
    );
    router.post(
      "/grant",
      authMiddleware,
      permissionMiddleware("roleManagement", true),
      permissionValidator,
      this.grantPermission
    );
    router.post(
      "/deny",
      authMiddleware,
      permissionMiddleware("roleManagement", true),
      permissionValidator,
      this.denyPermission
    );
    router.post("/all", authMiddleware, this.getUsers);
    router.post("/single", authMiddleware, userIdValidator, this.getUserById);
    return router;
  }
  static route = "/user";
}
