import { RequestHandler, Router } from "express";
import prisma from "../db";

export class ContactController {
  static createContact: RequestHandler = async (req, res) => {
    let { name, phone, userId } = req.body;
    let contact = await prisma.contact.create({
      data: {
        name,
        userId,
        phone,
      },
    });
    res.send(contact);
  };

  static getContactById: RequestHandler = async (req, res) => {
    let { contactId } = req.body;
    let contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
      },
    });
    res.send(contact);
  };

  static getContactsByUserId: RequestHandler = async (req, res) => {
    let { userId } = req.body;
    let contacts = await prisma.contact.findMany({
      where: {
        userId,
      },
    });
    res.send(contacts);
  };

  static route = "/contact";
  static setup = () => {
    const router = Router();
    router.post("/", ContactController.createContact);
    router.post("/get", ContactController.getContactById);
    router.post("/byUserId", ContactController.getContactsByUserId);

    return router;
  };
}
