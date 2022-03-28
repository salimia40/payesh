import { RequestHandler, Router } from "express";
import prisma from "../db";

export default class CityController {
  static createCity: RequestHandler = async (req, res) => {
    let { name } = req.body;
    prisma.city.create({
      data: {
        name,
      },
    });

    res.sendStatus(200);
  };

  static getCities: RequestHandler = async (req, res) => {
    let cities = await prisma.city.findMany();
    res.send(cities);
  };

  static getCityById: RequestHandler = async (req, res) => {
    let { cityId } = req.body;
    let city = await prisma.city.findFirst({
      where: {
        id: cityId,
      },
    });
    res.send(city);
  };

  static setup() {
    let router = Router();
    router.post("/new", this.createCity);
    router.post("/all", this.getCities);
    router.post("/single", this.getCityById);
    return router;
  }
  static route = "/city";
}
