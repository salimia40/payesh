import { User } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      user?: User | undefined;
      loggedIn?: boolean | undefined;
      tokenId?: number | undefined;
      hasPermission?: boolean;
    }
  }
}
