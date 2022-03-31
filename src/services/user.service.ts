import { TokenType, UserRole } from "@prisma/client";
import prisma from "../db";
import { add, isPast } from "date-fns";
import SMSService from "./sms.service";

type Permission =
  | "userVerification"
  | "roleManagement"
  | "realStateView"
  | "realStateVerification"
  | "suspendUsers";

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

    console.log(token);

    if (!token) throw new Error("invalid token");
    else if (isPast(token.expiresAt)) throw new Error("token expired");

    console.log("no errors");

    await prisma.user.update({
      where: {
        phoneNumber,
      },
      data: {
        Verified: true,
      },
    });
    return;
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
    let user = await prisma.user.findFirst({ where: { phoneNumber } });
    if (user !== null) throw new Error("User already exists");
    let admins = await prisma.user.count({ where: { role: UserRole.admin } });
    console.log(admins);
    let role = admins > 0 ? UserRole.agent : UserRole.admin;
    console.log(role);
    console.log(role, birthdate);
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

    SMSService.sendVerificationCode(user.phoneNumber, generatedToken);

    return user;
  }

  static grantPermission = async (userId: number, permission: Permission) => {
    await this.setPermission(userId, permission, true);
  };

  static denyPermission = async (userId: number, permission: Permission) => {
    await this.setPermission(userId, permission, false);
  };

  private static setPermission = async (
    userId: number,
    permission: Permission,
    enabled: boolean
  ) => {
    let permissions = await prisma.permissions.findFirst({ where: { userId } });
    switch (permission) {
      case "userVerification":
        await prisma.permissions.update({
          where: { id: permissions?.id },
          data: { userVerification: enabled },
        });
        break;
      case "roleManagement":
        await prisma.permissions.update({
          where: { id: permissions?.id },
          data: { roleManagement: enabled },
        });
        break;
      case "realStateView":
        await prisma.permissions.update({
          where: { id: permissions?.id },
          data: { realStateView: enabled },
        });
        break;
      case "realStateVerification":
        await prisma.permissions.update({
          where: { id: permissions?.id },
          data: { realStateVerification: enabled },
        });
        break;
      case "suspendUsers":
        await prisma.permissions.update({
          where: { id: permissions?.id },
          data: { suspendUsers: enabled },
        });
        break;
    }
  };

  static async userExists(phoneNumber: string) {
    let user = await prisma.user.findFirst({ where: { phoneNumber } });
    return user !== null;
  }
}
