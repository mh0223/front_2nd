import { http, HttpResponse } from "msw";
import { Event } from "./types";
let events = [
  {
    id: 1,
    title: "팀 회의 msw",
    date: "2024-07-20",
    startTime: "10:00",
    endTime: "11:00",
    description: "주간 팀 미팅",
    location: "회의실 A",
    category: "업무",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 1,
  },
  {
    id: 2,
    title: "점심 약속 msw",
    date: "2024-07-21",
    startTime: "12:30",
    endTime: "13:30",
    description: "동료와 점심 식사",
    location: "회사 근처 식당",
    category: "개인",
    repeat: { type: "none", interval: 0 },
    notificationTime: 1,
  },
  {
    id: 3,
    title: "알림 테스트 msw",
    description: "알림 테스트",
    location: "알림 테스트",
    category: "기타",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 60,
    ...(() => {
      const now = new Date();
      const startTime = new Date(now.getTime() + 5 * 60000); // 5분 후
      const endTime = new Date(startTime.getTime() + 60 * 60000); // 시작시간으로부터 1시간 후

      const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
      };

      const formatTime = (date: Date) => {
        return date.toTimeString().split(" ")[0].substring(0, 5);
      };

      return {
        date: formatDate(now),
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
      };
    })(),
  },
];

export const mockApiHandlers = [
  // 일정 조회
  http.get("/api/events", () => {
    return HttpResponse.json(events);
  }),

  // 일정 추가
  http.post("/api/events", async ({ request }) => {
    const userEvent = (await request.json()) as Event;

    events.push(userEvent);
    return HttpResponse.json(userEvent, { status: 201 });
  }),

  // 일정 수정
  http.put("/api/events/:id", async ({ params, request }) => {
    const id = parseInt(params.id[0]);
    const eventIndex = events.findIndex((event) => event.id === id);
    const modifiedEvent = (await request.json()) as Event;

    if (eventIndex > -1) {
      events[eventIndex] = { ...events[eventIndex], ...modifiedEvent };
      return HttpResponse.json(events[eventIndex]);
    } else {
      return HttpResponse.json("Event not found", { status: 404 });
    }
  }),

  // 일정 삭제
  http.delete("/api/events/:id", ({ params }) => {
    const id = Array.isArray(params.id)
      ? parseInt(params.id[0])
      : parseInt(params.id[0]);
    events = events.filter((event) => event.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
