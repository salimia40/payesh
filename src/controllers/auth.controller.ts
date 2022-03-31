import { TokenType } from "@prisma/client";
import { add, isPast } from "date-fns";
import { RequestHandler, Router } from "express";
import prisma from "../db";
import SMSService from "../services/sms.service";
import TokenService from "../services/token.service";
import UserService from "../services/user.service";
import {
  phoneNumberValidator,
  registerValidator,
  verifyValidator,
} from "./validators";

export default class AuthController {
  private static userExistsHandler: RequestHandler = async (req, res) => {
    let phoneNumber = req.body.phoneNumber;
    let exists = await UserService.userExists(phoneNumber);
    res.send({ exists });
  };

  private static registerHandler: RequestHandler = async (req, res) => {
    let {
      firstName,
      lastName,
      nationalId,
      phoneNumber,
      fatherName,
      address,
      birthdate,
      regionId,
    } = req.body;

    console.log(birthdate);

    try {
      let user = await UserService.createUser(
        firstName,
        lastName,
        nationalId,
        phoneNumber,
        fatherName,
        address,
        new Date(birthdate),
        +regionId
      );

      res.send(user);
    } catch (error) {
      if (error instanceof Error) res.boom.badRequest(error.message);
    }
  };

  private static verificationHandler: RequestHandler = async (req, res) => {
    let { code, phoneNumber } = req.body;

    try {
      await UserService.verify(phoneNumber, code);
      res.sendStatus(200);
    } catch (error) {
      if (error instanceof Error) res.boom.badRequest(error.message);
    }
  };

  private static loginHandler: RequestHandler = async (req, res) => {
    const { phoneNumber } = req.body;

    if (!(await UserService.userExists(phoneNumber))) {
      return res.boom.badRequest("user doesn't exist");
    }

    let generatedToken = UserService.generateToken();
    let expirationDate = add(new Date(), {
      minutes: process.env.LOGIN_TOKEN_EXPIRATION_MINUTES as unknown as number,
    });

    await prisma.token.create({
      data: {
        user: {
          connect: {
            phoneNumber,
          },
        },
        expiresAt: expirationDate,
        payload: generatedToken,
        type: TokenType.login,
      },
    });

    SMSService.sendVerificationCode(phoneNumber, generatedToken);

    res.sendStatus(200);
  };

  private static authenticationHandler: RequestHandler = async (req, res) => {
    const { phoneNumber, code } = req.body;
    const fetchedToken = await prisma.token.findFirst({
      where: {
        payload: code,
        user: {
          phoneNumber,
        },
        type: TokenType.login,
      },
    });

    if (!fetchedToken) throw new Error("invalid token");
    else if (isPast(fetchedToken.expiresAt)) throw new Error("token expired");

    let token = await TokenService.generateAuthToken(phoneNumber);
    let jwtToken = TokenService.generateAuthJWT(token.id);

    res.header("Authorization", jwtToken);
    return res.sendStatus(200);
  };

  static setup() {
    let router = Router();
    router.post("/exists", phoneNumberValidator, this.userExistsHandler);
    router.post("/register", registerValidator, this.registerHandler);
    router.post("/verification", verifyValidator, this.verificationHandler);
    router.post("/login", phoneNumberValidator, this.loginHandler);
    router.post("/authentication", verifyValidator, this.authenticationHandler);
    return router;
  }

  static route = "/auth";
}
