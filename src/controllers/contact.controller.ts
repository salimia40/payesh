import { RequestHandler, Router } from "express";
import prisma from "../db";
import {
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

  static route = "/contact";
  static setup = () => {
    const router = Router();
    router.post("/new", contactInputValidator, ContactController.createContact);
    router.post("/get", contactIdValidator, ContactController.getContactById);
    router.post(
      "/user",
      userIdValidator,
      ContactController.getContactsByUserId
    );

    return router;
  };
}
