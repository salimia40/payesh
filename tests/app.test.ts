// import { requestWithSupertest } from "./def.test";
import App from "../src/App";
import supertest from "supertest";

export const server = new App().app;
export const requestWithSupertest = supertest(server);

describe("App", () => {
  it("unknown path should respond with 404 status code", async () => {
    const response = await requestWithSupertest.get("/unknown");
    expect(response.statusCode).toEqual(200);
  });
});

export {};
