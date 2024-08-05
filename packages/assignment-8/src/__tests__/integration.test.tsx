import { ReactNode } from "react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import {
  findByRole,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import App from "../App.tsx";
import { currentDateStore } from "../store/currentDateStore.ts";

const setupInitItems = (component: ReactNode) => {
  // const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const user = userEvent.setup();
  return {
    user,
    ...render(component),
  };
};

const clearEventInputs = async (user: UserEvent) => {
  // 제목 입력 (text)
  const titleInput = screen.getByLabelText("제목"); // 정규식 사용한 예: const titleInput = screen.getByLabelText(/제목/i); //i: 영어라면, 대소문자 상관없이 만들어줌
  await user.clear(titleInput);

  // 날짜 입력 (date)
  const dateInput = screen.getByLabelText("날짜");
  await user.clear(dateInput);

  // 시작 시간 정하기 (time)
  const startTimeInput = screen.getByLabelText("시작 시간");
  await user.clear(startTimeInput);

  // 종료 시간 정하기 (time)
  const endTimeInput = screen.getByLabelText("종료 시간");
  await user.clear(endTimeInput);

  // 설명 입력 (text)
  const descriptionInput = screen.getByLabelText("설명");
  await user.clear(descriptionInput);

  // 위치 입력 (text)
  const locationInput = screen.getByLabelText("위치");
  await user.clear(locationInput);

  // 카테고리 선택 (select)
  await user.selectOptions(screen.getByLabelText("카테고리"), ["기타"]);

  // 알림 설정 (select)
  await user.selectOptions(screen.getByLabelText("알림 설정"), ["1분 전"]);
};

const fillEventInputs = async (user: UserEvent) => {
  // 제목 입력 (text)
  const titleInput = screen.getByLabelText("제목"); // 정규식 사용한 예: const titleInput = screen.getByLabelText(/제목/i); //i: 영어라면, 대소문자 상관없이 만들어줌
  await user.type(titleInput, "새로운 이벤트");

  // 날짜 입력 (date)
  const dateInput = screen.getByLabelText("날짜");
  await user.type(dateInput, "2024-07-02");

  // 시작 시간 정하기 (time)
  const startTimeInput = screen.getByLabelText("시작 시간");
  await user.type(startTimeInput, "13:00");

  // 종료 시간 정하기 (time)
  const endTimeInput = screen.getByLabelText("종료 시간");
  await user.type(endTimeInput, "15:00");

  // 설명 입력 (text)
  const descriptionInput = screen.getByLabelText("설명");
  await user.type(descriptionInput, "설명은 이거입니다~");

  // 위치 입력 (text)
  const locationInput = screen.getByLabelText("위치");
  await user.type(locationInput, "경기도");

  // 카테고리 선택 (select)
  await user.selectOptions(screen.getByLabelText("카테고리"), ["가족"]);

  // 알림 설정 (select)
  await user.selectOptions(screen.getByLabelText("알림 설정"), ["10분 전"]);
};

describe("일정 관리 애플리케이션 통합 테스트 8주차 basic", () => {
  describe("반복 일정에 대한 요구사항 추가", () => {
    test("일정 생성 또는 수정 시 반복 유형을 선택할 수 있다.", async () => {});
    test("각 반복 유형에 대해 간격을 설정할 수 있다.", async () => {});
    test("캘린더 뷰에서 반복 일정을 시각적으로 구분하여 표시한다", async () => {});
  });

  describe("예외 날짜 처리", () => {
    test("반복 일정 중 특정 날짜를 제외할 수 있다.", async () => {});
    test("반복 일정 중 특정 날짜의 일정을 수정할 수 있다.", async () => {});
  });

  describe("반복 종료 조건", () => {
    test("반복 종료 조건을 지정할 수 있다.(옵션: 특정 날짜까지, 특정 횟수만큼, 또는 종료 없음)", async () => {});
  });

  describe("요일 지정 (주간 반복의 경우)", () => {
    test("주간 반복 시 특정 요일을 선택할 수 있다.", async () => {});
  });

  describe("월간 반복 옵션", () => {
    test("매월 특정 날짜에 반복되도록 설정할 수 있다.", async () => {});
    test("매월 특정 순서의 요일에 반복되도록 설정할 수 있다.", async () => {});
  });

  describe("반복 일정 수정", () => {
    test("반복 일정의 단일 일정을 수정할 수 있다.", async () => {});
    test("반복 일정의 모든 일정을 수정할 수 있다.", async () => {});
  });
});

describe.skip("일정 관리 애플리케이션 통합 테스트 8주차 advanced", () => {
  describe("반복 일정에 대한 요구사항 추가", () => {
    test("일정 생성 또는 수정 시 반복 유형을 선택할 수 있다.", async () => {});
    test("각 반복 유형에 대해 간격을 설정할 수 있다.", async () => {});
    test("캘린더 뷰에서 반복 일정을 시각적으로 구분하여 표시한다", async () => {});
  });
});
