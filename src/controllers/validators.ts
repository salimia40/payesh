import { validateRequest } from "zod-express-middleware";
import { z } from "zod";

export const userIdValidator = validateRequest({
  body: z.object({
    userId: z.number(),
  }),
});

export const permissionValidator = validateRequest({
  body: z.object({
    userId: z.number(),
    permission: z.enum([
      "userVerification",
      "roleManagement",
      "realStateView",
      "realStateVerification",
      "suspendUsers",
    ]),
  }),
});

export const regionInputValidator = validateRequest({
  body: z.object({
    name: z.string(),
    cityId: z.number(),
  }),
});

export const cityIdValidator = validateRequest({
  body: z.object({
    cityId: z.number(),
  }),
});

export const cityInputValidator = validateRequest({
  body: z.object({
    name: z.string(),
  }),
});

export const regionIdValidator = validateRequest({
  body: z.object({
    regionId: z.number(),
  }),
});

export const contactIdValidator = validateRequest({
  body: z.object({
    contactId: z.number(),
  }),
});

export const contactInputValidator = validateRequest({
  body: z.object({
    userId: z.number(),
    name: z.string(),
    phone: z.string(),
  }),
});

export const phoneNumberValidator = validateRequest({
  body: z.object({
    phoneNumber: z.number(),
  }),
});
export const pictureIdValidator = validateRequest({
  body: z.object({
    pictureId: z.number(),
  }),
});
export const pictureInputValidator = validateRequest({
  body: z.object({
    propertyId: z.number(),
    isMain: z.boolean(),
  }),
});
export const propertyIdValidator = validateRequest({
  body: z.object({
    propertyId: z.number(),
  }),
});
export const propertyViewValidator = validateRequest({
  body: z.object({
    propertyId: z.number(),
    userId: z.number(),
  }),
});
export const propertyTypeValidator = validateRequest({
  body: z.object({
    type: z.enum(["house", "apartment", "land"]),
  }),
});
export const propertyTypeRegionValidator = validateRequest({
  body: z.object({
    type: z.enum(["house", "apartment", "land"]),
    regionId: z.number(),
  }),
});
export const propertyInputValidator = validateRequest({
  body: z.object({
    type: z.enum(["house", "apartment", "land"]),
    regionId: z.number(),
    address: z.string(),
    description: z.string(),
    price: z.number(),
    minPrice: z.number(),
    maxPrice: z.number(),
    isForRent: z.boolean(),
    numberOfBaths: z.number(),
    numberOfBeds: z.number(),
    numberOfRooms: z.number(),
    area: z.number(),
    numberOfToilets: z.number(),
    name: z.string(),
    status: z.enum(["available", "sold", "rented"]),
    userId: z.number(),
    contactId: z.number(),
  }),
});

export const propertyStatusValidator = validateRequest({
  body: z.object({
    propertyId: z.number(),
    status: z.enum(["available", "sold", "rented"]),
  }),
});

export const verifyValidator = validateRequest({
  body: z.object({
    phoneNumber: z.string(),
    code: z.string(),
  }),
});

export const registerValidator = validateRequest({
  body: z.object({
    phoneNumber: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    nationalId: z.string(),
    fatherName: z.string(),
    address: z.string(),
    birthdate: z.number(),
    regionId: z.number(),
  }),
});
