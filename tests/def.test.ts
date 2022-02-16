import App from "../src/App";
import supertest from "supertest";

export const server = new App().app;
export const requestWithSupertest = supertest(server);
