import { RequestHandler, Router } from "express";
import prisma from "../db";
import authMiddleware from "../middlewares/auth.middleware";
import permissionMiddleware from "../middlewares/permission.middleware";
import {
  cityIdValidator,
  contactIdValidator,
  contactInputValidator,
  userIdValidator,
} from "./validators";

export class ContactController {
  static createContact: RequestHandler = async (req, res) => {
    let { name, phone, userId } = req.body;
    let contact = await prisma.contact.create({
      data: {
        name,
        userId: +userId,
        phone,
      },
    });
    res.send(contact);
  };

  static getContactById: RequestHandler = async (req, res) => {
    let { contactId } = req.body;
    let contact = await prisma.contact.findFirst({
      where: {
        id: +contactId,
      },
    });
    res.send(contact);
  };

  static getContactsByUserId: RequestHandler = async (req, res) => {
    let { userId } = req.body;
    let contacts = await prisma.contact.findMany({
      where: {
        userId: +userId,
      },
    });
    res.send(contacts);
  };

  // get contacts by cityId

  static getContactsByCityId: RequestHandler = async (req, res) => {
    let { cityId } = req.body;
    let contacts = await prisma.property.findFirst({
      where: {
        id: +cityId,
      },
      include: {
        contact: true,
      },
    }).contact;
    res.send(contacts);
  };

  static route = "/contact";
  static setup = () => {
    const router = Router();
    router.post(
      "/new",
      authMiddleware,
      contactInputValidator,
      ContactController.createContact
    );
    router.post(
      "/get",
      authMiddleware,
      contactIdValidator,
      ContactController.getContactById
    );
    router.post(
      "/user",
      authMiddleware,
      userIdValidator,
      ContactController.getContactsByUserId
    );

    router.post(
      "/city",
      authMiddleware,
      permissionMiddleware("realStateView", true),
      cityIdValidator,
      ContactController.getContactsByCityId
    );

    return router;
  };
}
