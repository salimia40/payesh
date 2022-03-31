import { RequestHandler } from "express";
import prisma from "../db";
import TokenService from "../services/token.service";

const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader) {
      const { tokenId } = TokenService.decriptToken(authHeader);

      const fetchedToken = await prisma.token.findUnique({
        where: {
          id: tokenId,
        },
        include: {
          user: {
            include: { permissions: true },
          },
        },
      });

      // Check if token could be found in database and is valid
      if (!fetchedToken || fetchedToken.expiresAt < new Date()) {
        return res.boom.unauthorized("Invalid Token");
      }

      req.user = fetchedToken.user;
      req.loggedIn = true;
      req.tokenId = tokenId;

      return next();
    } else {
      res.boom.unauthorized();
    }
  } catch (error: any) {
    res.boom.badRequest(error.message);
  }
};

export default authMiddleware;
