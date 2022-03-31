import { RequestHandler } from "express";
import prisma from "../db";

type permission =
  | "userVerification"
  | "roleManagement"
  | "realStateView"
  | "realStateVerification"
  | "suspendUsers";

const permissionMiddleware: (
  permission: permission,
  block: boolean
) => RequestHandler = (permission, block) => {
  return async (req, res, next) => {
    try {
      let permissions = await prisma.permissions.findUnique({
        where: {
          userId: req.user?.id,
        },
      });

      if (permissions && permissions[permission]) {
        req.hasPermission = true;
        return next();
      } else {
        req.hasPermission = false;
        if (block) res.boom.unauthorized();
        else return next();
      }
    } catch (error: any) {
      res.boom.badRequest(error.message);
    }
  };
};

export default permissionMiddleware;
