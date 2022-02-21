import { TokenType } from "@prisma/client";
import { add } from "date-fns";
import jwt from "jsonwebtoken";
import prisma from "../db";

interface APITokenPayload {
  tokenId: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_JWT_SECRET";
const JWT_ALGORITHM = "HS256";

export default class TokenService {
  static async generateAuthToken(phoneNumber: string) {
    let token = await prisma.token.create({
      data: {
        user: {
          connect: {
            phoneNumber,
          },
        },
        expiresAt: add(new Date(), {
          minutes: process.env
            .AUTH_TOKEN_EXPIRATION_MINUTES as unknown as number,
        }),
        type: TokenType.authentication,
      },
    });
    return token;
  }

  static generateAuthJWT(tokenId: number): string {
    const jwtPayload = { tokenId };

    return jwt.sign(jwtPayload, JWT_SECRET, {
      algorithm: JWT_ALGORITHM,
      noTimestamp: true,
    });
  }

  static decriptToken(token: string) {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    }) as APITokenPayload;
  }
}
