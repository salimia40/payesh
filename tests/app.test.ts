// import { requestWithSupertest } from "./def.test";
import App from "../src/App";
import supertest from "supertest";

const app = new App();
export const server = app.app;
export const requestWithSupertest = supertest(server);

describe("App", () => {
  it("initializes with express server", () => {
    expect(server).toBeDefined();
    expect(typeof server).toBe("function");
    expect(server.listen).toBeDefined();
  });

  it("unknown path should respond with 404 status code", async () => {
    const response = await requestWithSupertest.get("/unknown");
    expect(response.statusCode).toEqual(404);
  });
});

export {};
