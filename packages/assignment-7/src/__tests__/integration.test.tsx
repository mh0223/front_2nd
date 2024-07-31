import { ReactNode } from "react";

import userEvent, { UserEvent } from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@testing-library/react";
import App from "../App.tsx";

const setupInitItems = (component: ReactNode) => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

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
  await user.type(dateInput, "2024-07-01");

  // 시작 시간 정하기 (time)
  const startTimeInput = screen.getByLabelText("시작 시간");
  await user.type(startTimeInput, "10:00");

  // 종료 시간 정하기 (time)
  const endTimeInput = screen.getByLabelText("종료 시간");
  await user.type(endTimeInput, "12:00");

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

describe("일정 관리 애플리케이션 통합 테스트", () => {
  describe.only("일정 CRUD 및 기본 기능", () => {
    test("새로운 일정을 생성하고, '검색 리스트 및 달력'에 새로운 일정이 입력한대로 저장되는지 확인한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 수동 쿼리 예시 (권장 x)
      // const {container} = render(<App />)
      // const foo = container.querySelector('[data-foo="bar"]')

      // 2. 필수 input 모두 채우기
      await fillEventInputs(user);

      // 3. 일정 추가 버튼 클릭
      const addEventBtn = screen.getByRole("button", {
        name: "일정 추가",
      });
      await user.click(addEventBtn);

      // 4. 추가된 일정 확인하기
      // expect(screen.getByText("새로운 이벤트")).toBeInTheDocument(); // 달력에도 추가가 되어서 중복이 뜸
      // 4-1) 검색 리스트 확인하기
      const searchItemsContainer = screen.getByRole("searchItemsContainer"); // 유저 동작 비슷하게 하기 위해 testId x -> role 추가해서 사용
      expect(
        await within(searchItemsContainer).findByText("새로운 이벤트")
      ).toBeInTheDocument();

      expect(
        await within(searchItemsContainer).findByText(
          "2024-07-01 10:00 - 12:00"
        ) // 정규식 사용한 예: await within(searchItemsContainer).findByText(/10:00\s*-\s*12:00/) // \s*: 공백 문자가 0개 이상 있는지 확인하는 패턴
      ).toBeInTheDocument();

      expect(
        await within(searchItemsContainer).findByText("설명은 이거입니다~")
      ).toBeInTheDocument();

      expect(
        await within(searchItemsContainer).findByText("경기도")
      ).toBeInTheDocument();

      expect(
        await within(searchItemsContainer).findByText("카테고리: 가족")
      ).toBeInTheDocument();

      expect(
        await within(searchItemsContainer).findByText("알림: 10분 전")
      ).toBeInTheDocument();

      // 4-2) 달력에 새로 추가한 일정 제목 확인
      const calendarItems = screen.getByRole("monthView");
      expect(
        await within(calendarItems).findByText("새로운 이벤트")
      ).toBeInTheDocument();
    });

    test("기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. 수정할 일정 찾기

      // 인덱스 사용하지 않고 찾은 방법 (비효율적)
      // const searchItemsContainer = screen.getByRole("searchItemsContainer");
      // const titleElement = await within(searchItemsContainer).findByText("팀 회의 msw");
      // const searchItem = titleElement.parentElement?.parentElement
      //   ?.parentElement as HTMLElement;

      const searchItems = (await screen.findAllByRole(
        "searchItem"
      )) as HTMLElement[];

      const searchItem = searchItems[0]; // 팀 회의 msw

      // 3. 수정할 일정의 수정 아이콘 누르기
      const editIcon = await within(searchItem).findByLabelText("Edit event");
      await user.click(editIcon);

      // 4. 일정 수정하기
      await clearEventInputs(user);
      await fillEventInputs(user);

      // 5. 일정 수정 버튼 클릭
      const editEventBtn = screen.getByRole("button", {
        name: "일정 수정",
      });
      await user.click(editEventBtn);

      // 6. 수정된 일정 확인하기
      // 6-1) 검색 리스트 중 수정한 일정 내용 확인하기
      const formerEventTitle = screen.queryByText("팀 회의 msw");
      expect(formerEventTitle).not.toBeInTheDocument();
      expect(
        await within(searchItem).findByText("새로운 이벤트")
      ).toBeInTheDocument();

      const formerEventDate = screen.queryByText("2024-07-20 10:00 - 11:00");
      expect(formerEventDate).not.toBeInTheDocument();
      expect(
        await within(searchItem).findByText("2024-07-01 10:00 - 12:00") // 정규식 사용한 예: await within(searchItemsContainer).findByText(/10:00\s*-\s*12:00/) // \s*: 공백 문자가 0개 이상 있는지 확인하는 패턴
      ).toBeInTheDocument();

      const formerEventDescription = screen.queryByText("주간 팀 미팅");
      expect(formerEventDescription).not.toBeInTheDocument();
      expect(
        await within(searchItem).findByText("설명은 이거입니다~")
      ).toBeInTheDocument();

      const formerEventLocation = screen.queryByText("회의실 A");
      expect(formerEventLocation).not.toBeInTheDocument();
      expect(await within(searchItem).findByText("경기도")).toBeInTheDocument();

      const formerEventCategory = screen.queryByText("카테고리: 업무");
      expect(formerEventCategory).not.toBeInTheDocument();
      expect(
        await within(searchItem).findByText("카테고리: 가족")
      ).toBeInTheDocument();

      const formerEventAlarm = screen.queryByText("알림: 1분 전");
      expect(formerEventAlarm).not.toBeInTheDocument();
      expect(
        await within(searchItem).findByText("알림: 10분 전")
      ).toBeInTheDocument();

      // 6-2) 달력에 새로 추가한 일정 제목 확인

      const calendarItems = screen.getByRole("monthView");

      const formerEventTitleInCalendar =
        within(calendarItems).queryByText("팀 회의 msw");
      expect(formerEventTitleInCalendar).not.toBeInTheDocument();
      expect(
        await within(calendarItems).findByText("새로운 이벤트")
      ).toBeInTheDocument();
    });

    test("일정을 삭제하고 더 이상 조회되지 않는지 확인한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. 삭제할 일정 찾기

      // 인덱스 사용하지 않고 찾은 방법 (비효율적)
      // const searchItemsContainer = screen.getByRole("searchItemsContainer");
      // // const titleElement = await within(searchItemsContainer).findByText("팀 회의 msw");
      // const titleElement =
      //   await within(searchItemsContainer).findByText("점심 약속 msw"); // 앞의 테스트의 렌더링이 그대로 이어져서 이렇게 해야 통과됨,,
      // const searchItem = titleElement.parentElement?.parentElement
      //   ?.parentElement as HTMLElement;

      const searchItems = (await screen.findAllByRole(
        "searchItem"
      )) as HTMLElement[];

      const searchItem = searchItems[1]; // 점심 약속 msw

      // 3. 삭제할 일정의 삭제 아이콘 누르기
      const deleteIcon =
        await within(searchItem).findByLabelText("Delete event");
      await user.click(deleteIcon);

      // 4. 삭제되었는지 확인하기
      // getBy~나 findBy~로 가져오면 에러남(삭제된 것 찾으려고 해서)
      // queryBy~로 가져와야 삭제되었거나 없어도 에러 안 남
      const deletedEventTitle = screen.queryByText("점심 약속 msw");
      expect(deletedEventTitle).not.toBeInTheDocument();
      // expect(deletedTitle).toBeNull(); // toBeNull()도 가능

      const deletedEventDate = screen.queryByText("2024-07-21 12:30 - 13:30");
      expect(deletedEventDate).not.toBeInTheDocument();

      const deletedEventDescription = screen.queryByText("동료와 점심 식사");
      expect(deletedEventDescription).not.toBeInTheDocument();

      const deletedEventLocation = screen.queryByText("회사 근처 식당");
      expect(deletedEventLocation).not.toBeInTheDocument();

      const deletedEventCategory = screen.queryByText("업무: 개인");
      expect(deletedEventCategory).not.toBeInTheDocument();

      const deletedEventAlarm = screen.queryByText("알림: 2시간 전");
      expect(deletedEventAlarm).not.toBeInTheDocument();
    });
  });

  // fake timer (어제 실행되어도 오늘 실행되어도 같은 결과 낼 수 있도록 해야함)
  // appear, disappear
  describe("일정 뷰 및 필터링", () => {
    test("주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. Week 선택
      const viewSelect = screen.getByRole("combobox", {
        name: /view/i,
      });
      await user.selectOptions(viewSelect, ["Week"]);

      // 3. weekView element 가져오기
      const weekView = await screen.findByRole("weekView");

      // 4.calendarItems 변수 선언
      let calendarItems = [];

      // 5. 일정 있는지 없는지 확인후 일정 표시 여부 검증
      // 비동기적으로 calendarItem이 생성 + 아예 없는 경우 고려
      // = waitFor + queryAllByRole 사용
      await waitFor(async () => {
        // queryAllByRole을 통해 없는 경우까지 처리
        calendarItems = within(weekView).queryAllByRole("calendarItem");

        // 갯수 구하기
        const calendarItemsCount = calendarItems.length;

        // 하나도 없을 때 (갯수 0일 때)는 weekView에 없어야한다.
        if (calendarItemsCount === 0) {
          expect(
            within(weekView).queryByRole("calendarItem")
          ).not.toBeInTheDocument();
        }

        // 일정이 존재 할 때는 weekView에 있어야한다.
        if (calendarItemsCount < 0) {
          expect(
            within(weekView).queryByRole("calendarItem")
          ).toBeInTheDocument();
        }
      });
    });

    test("월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. Month 선택
      const viewSelect = screen.getByRole("combobox", {
        name: /view/i,
      });
      await user.selectOptions(viewSelect, ["Month"]);

      // 3. monthView element 가져오기
      const monthView = await screen.findByRole("monthView");

      // 4.calendarItems 변수 선언
      let calendarItems = [];

      // 5. 일정 있는지 없는지 확인후 일정 표시 여부 검증
      // 비동기적으로 calendarItem이 생성 + 아예 없는 경우 고려
      // = waitFor + queryAllByRole 사용
      await waitFor(async () => {
        // queryAllByRole을 통해 없는 경우까지 처리
        calendarItems = within(monthView).queryAllByRole("calendarItem");

        // 갯수 구하기
        const calendarItemsCount = calendarItems.length;
        // 하나도 없을 때 (갯수 0일 때)는 monthView에 없어야한다.
        if (calendarItemsCount === 0) {
          expect(
            within(monthView).queryByRole("calendarItem")
          ).not.toBeInTheDocument();
        }

        // 일정이 존재 할 때는 monthView에 있어야한다.
        if (calendarItemsCount < 0) {
          expect(
            within(monthView).queryByRole("calendarItem")
          ).toBeInTheDocument();
        }
      });
    });

    test("주별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. Week 선택
      const viewSelect = screen.getByRole("combobox", {
        name: /view/i,
      });
      await user.selectOptions(viewSelect, ["Week"]);

      // 3. weekView element 가져오기
      const weekView = await screen.findByRole("weekView");

      // 4.calendarItems 변수 선언
      let calendarItems = [];

      // 5. 일정 있다면 "정확히" 표시되는지 확인 - 제목
      await waitFor(async () => {
        // queryAllByRole을 통해 없는 경우까지 처리
        calendarItems = within(weekView).queryAllByRole("calendarItem");

        // 갯수 구하기
        const calendarItemsCount = calendarItems.length;

        // 일정이 존재 할 때는 weekView에 있어야한다.
        if (calendarItemsCount < 0) {
          expect(
            within(weekView).queryByRole("calendarItem")
          ).toBeInTheDocument();
        }
      });
    });

    test("월별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      const { user } = setupInitItems(<App />);

      // Month 선택
      const viewSelect = screen.getByRole("combobox", {
        name: /view/i,
      });
      await user.selectOptions(viewSelect, ["Month"]);

      const monthView = screen.getByRole("monthView");
    });
  });

  describe("알림 기능", () => {
    test("일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다", async () => {
      // console.log(new Date());
    });
  });

  describe("검색 기능", () => {
    test.fails("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다");
    test.fails("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다");
    test.fails("검색어를 지우면 모든 일정이 다시 표시되어야 한다");
  });

  describe("공휴일 표시", () => {
    test.fails("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다");
    test.fails("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다");
  });

  describe("일정 충돌 감지", () => {
    test.fails("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다");
    test.fails(
      "기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다"
    );
  });
});
