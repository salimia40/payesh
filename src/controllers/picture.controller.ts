import { RequestHandler, Router } from "express";
import prisma from "../db";
import multer, { memoryStorage } from "multer";

export class PictureController {
  static upload = multer({ dest: "/uploads", storage: memoryStorage() }).single(
    "image"
  );

  static getPictureById: RequestHandler = async (req, res) => {
    let { pictureId } = req.body;
    let picture = await prisma.picture.findFirst({
      where: {
        id: pictureId,
      },
      select: {
        id: true,
        isMain: true,
        propertyId: true,
      },
    });
    res.send(picture);
  };

  static getPicturesByProperty: RequestHandler = async (req, res) => {
    let { propertyId } = req.body;
    let pictures = await prisma.picture.findMany({
      where: {
        propertyId,
      },
      select: {
        id: true,
        isMain: true,
        propertyId: true,
      },
    });
    res.send(pictures);
  };

  static createPicture: RequestHandler = async (req, res) => {
    let { propertyId, isMain } = req.body;

    let picture = await prisma.picture.create({
      data: {
        propertyId,
        isMain,
        data: Buffer.from(req.file?.buffer ?? ""),
      },
    });

    res.send(picture);
  };

  static getPicture: RequestHandler = async (req, res) => {
    let { pictureId } = req.body;
    let picture = await prisma.picture.findFirst({
      where: {
        id: pictureId,
      },
      select: {
        data: true,
      },
    });
    res.send(picture);
  };

  static route = "/picture";

  static setup = () => {
    const router = Router();
    router.post("/new", this.upload, this.createPicture);
    router.post("/byProperty", this.getPicturesByProperty);
    router.post("/single", this.getPictureById);
    router.post("/get", this.getPicture);

    return router;
  };
}
