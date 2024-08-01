import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { mockApiHandlers, resetEvents } from "./mockApiHandlers.ts";

const server = setupServer(...mockApiHandlers);

// ~Each - 테스트마다 실행
beforeEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
  vi.restoreAllMocks();
  vi.resetModules();

  resetEvents(); // 각 테스트마다 events 배열 초기화
});

afterEach(() => {
  server.resetHandlers();
});

// ~All - 처음 한 번 실행
beforeAll(() => {
  server.listen();
  vi.useFakeTimers({
    shouldAdvanceTime: true,
  });
  vi.setSystemTime(new Date("2024-07-01"));
});

afterAll(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();

  server.close();
});
