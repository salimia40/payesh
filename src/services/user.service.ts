import { TokenType, UserRole } from "@prisma/client";
import prisma from "../db";
import { add, isPast } from "date-fns";
import SMSService from "./sms.service";

export default class UserService {
  static async verify(phoneNumber: any, code: any) {
    let token = await prisma.token.findFirst({
      where: {
        user: {
          phoneNumber,
        },
        payload: code,
      },
    });

    if (!token) throw new Error("invalid token");
    else if (isPast(token.expiresAt)) throw new Error("token expired");

    await prisma.user.update({
      where: {
        phoneNumber,
      },
      data: {
        Verified: true,
      },
    });
  }
  static generateToken(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  static async createUser(
    firstName: string,
    lastName: string,
    nationalId: string,
    phoneNumber: string,
    fatherName: string,
    address: string,
    birthdate: Date,
    regionId: number
  ) {
    let user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (user !== null) throw new Error("User already exists");
    let admins = await prisma.user.count({ where: { role: UserRole.admin } });
    let role = admins > 0 ? UserRole.agent : UserRole.admin;
    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        fatherName,
        nationalId,
        birthdate,
        address,
        regionId,
        phoneNumber,
        role,
      },
    });

    await prisma.permissions.create({
      data:
        role == UserRole.agent
          ? {
              userId: user.id,
            }
          : {
              userId: user.id,
              userVerification: true,
              suspendUsers: true,
              realStateVerification: true,
              realStateView: true,
              roleManagement: true,
            },
    });

    let generatedToken = this.generateToken();
    let expirationDate = add(new Date(), {
      minutes: process.env
        .VERIFICATION_TOKEN_EXPIRATION_MINUTES as unknown as number,
    });

    await prisma.token.create({
      data: {
        userId: user.id,
        type: TokenType.validation,
        payload: generatedToken,
        expiresAt: expirationDate,
      },
    });

    SMSService.sendVerificationCode(generatedToken);

    return user;
  }
  static async userExists(phoneNumber: string) {
    let user = await prisma.user.findUnique({ where: { phoneNumber } });
    return user !== null;
  }
}
