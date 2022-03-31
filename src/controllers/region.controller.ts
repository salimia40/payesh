import { RequestHandler, Router } from "express";
import prisma from "../db";
import authMiddleware from "../middlewares/auth.middleware";
import {
  cityIdValidator,
  regionIdValidator,
  regionInputValidator,
} from "./validators";

export default class RegionController {
  static createRegion: RequestHandler = async (req, res) => {
    let { name, cityId } = req.body;
    await prisma.region.create({
      data: {
        name,
        cityId: +cityId,
      },
    });

    res.sendStatus(200);
  };

  static getRegions: RequestHandler = async (req, res) => {
    let regions = await prisma.region.findMany();
    res.send(regions);
  };

  static getRegionById: RequestHandler = async (req, res) => {
    let { regionId } = req.body;
    let region = await prisma.region.findFirst({
      where: {
        id: +regionId,
      },
    });
    res.send(region);
  };

  static getRegionsByCity: RequestHandler = async (req, res) => {
    let { cityId } = req.body;
    let regions = await prisma.region.findMany({
      where: {
        cityId: +cityId,
      },
    });
    res.send(regions);
  };

  static setup() {
    let router = Router();
    router.post(
      "/new",
      authMiddleware,
      regionInputValidator,
      this.createRegion
    );
    router.post("/all", this.getRegions);
    router.post("/single", regionIdValidator, this.getRegionById);
    router.post("/city", cityIdValidator, this.getRegionsByCity);
    return router;
  }
  static route = "/region";
}
