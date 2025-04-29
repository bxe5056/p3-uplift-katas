import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { afterAll, afterEach, beforeAll } from "vitest";

const allCountriesHandler = http.get("https://restcountries.com/v3.1/all", () =>
  HttpResponse.json([])
);

export const server = setupServer(allCountriesHandler);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
