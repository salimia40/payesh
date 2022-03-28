import { RequestHandler, Router } from "express";
import prisma from "../db";

export class PropertyController {
  static getPropertyById: RequestHandler = async (req, res) => {
    let { propertyId } = req.body;
    let property = await prisma.property.findFirst({
      where: {
        id: propertyId,
      },
    });
    res.send(property);
  };

  static createProperty: RequestHandler = async (req, res) => {
    let {
      regionId,
      address,
      description,
      price,
      minPrice,
      maxPrice,
      type,
      isForRent,
      numberOfBaths,
      numberOfBeds,
      numberOfRooms,
      area,
      numberOfToilets,
      name,
      status,
      userId,
      contactId,
    } = req.body;
    let property = await prisma.property.create({
      data: {
        name,
        address,
        regionId,
        userId,
        contactId,
        description,
        price,
        type,
        tradeType: isForRent ? "rent" : "sale",
        minPrice,
        maxPrice,
        numberOfBaths,
        numberOfBeds,
        numberOfRooms,
        numberOfToilets,
        area,
        status,
      },
    });

    res.send(property);
  };

  static getMostViewedProperties: RequestHandler = async (req, res) => {
    let properties = await prisma.property.findMany({
      orderBy: {
        views: "desc",
      },
      take: 10,
    });
    res.send(properties);
  };

  static getMostViewedPropertiesByType: RequestHandler = async (req, res) => {
    let { type } = req.body;
    let properties = await prisma.property.findMany({
      where: {
        type,
      },
      orderBy: {
        views: "desc",
      },
      take: 10,
    });
    res.send(properties);
  };

  static getMostViewedPropertiesByRegion: RequestHandler = async (req, res) => {
    let { regionId } = req.body;
    let properties = await prisma.property.findMany({
      where: {
        regionId,
      },
      orderBy: {
        views: "desc",
      },
      take: 10,
    });
    res.send(properties);
  };

  static getMostViewedPropertiesByTypeAndRegion: RequestHandler = async (
    req,
    res
  ) => {
    let { type, regionId } = req.body;
    let properties = await prisma.property.findMany({
      where: {
        type,
        regionId,
      },
      orderBy: {
        views: "desc",
      },
      take: 10,
    });
    res.send(properties);
  };

  static getPropertiesByUserId: RequestHandler = async (req, res) => {
    let { userId } = req.body;
    let properties = await prisma.property.findMany({
      where: {
        userId,
      },
      orderBy: {
        views: "desc",
      },
      take: 10,
    });
    res.send(properties);
  };

  static getPropertiesByRegionId: RequestHandler = async (req, res) => {
    let { regionId } = req.body;
    let properties = await prisma.property.findMany({
      where: {
        regionId,
      },
    });
    res.send(properties);
  };

  static viewProperty: RequestHandler = async (req, res) => {
    let { propertyId, userId } = req.body;
    let view = await prisma.view.create({
      data: {
        propertyId,
        userId,
      },
    });
    res.send(view);
  };

  static confirmProperty: RequestHandler = async (req, res) => {
    let { propertyId } = req.body;
    let property = await prisma.property.update({
      where: {
        id: propertyId,
      },
      data: {
        confirmed: true,
      },
    });
    res.send(property);
  };

  static route = "/property";
  static setup = () => {
    const router = Router();
    router.post("/create", PropertyController.createProperty);
    router.post("/view", PropertyController.viewProperty);
    router.post("/confirm", PropertyController.confirmProperty);
    router.post("/getById", PropertyController.getPropertyById);
    router.post(
      "/getMostViewedProperties",
      PropertyController.getMostViewedProperties
    );
    router.post(
      "/getMostViewedPropertiesByType",
      PropertyController.getMostViewedPropertiesByType
    );
    router.post(
      "/getMostViewedPropertiesByRegion",
      PropertyController.getMostViewedPropertiesByRegion
    );
    router.post(
      "/getMostViewedPropertiesByTypeAndRegion",
      PropertyController.getMostViewedPropertiesByTypeAndRegion
    );
    router.post(
      "/getPropertiesByUserId",
      PropertyController.getPropertiesByUserId
    );
    router.post(
      "/getPropertiesByRegionId",
      PropertyController.getPropertiesByRegionId
    );

    return router;
  };
}
