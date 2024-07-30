import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { mockApiHandlers } from "./mockApiHandlers.ts";

const server = setupServer(...mockApiHandlers);

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  server.close();
});
