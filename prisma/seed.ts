import prisma from "../src/db";

(async () => {
  await prisma.region.create({
    data: {
      name: "شهرک گلستان",
      city: {
        create: {
          name: "شیراز",
        },
      },
    },
  });
})();
