import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  useInterval,
  VStack,
} from "@chakra-ui/react";
import { eventsStore } from "../store/eventsStore";
import { notificationsStore } from "../store/notificationsStore";

export const AlertNotificationToast = () => {
  const { events, notifiedEvents, setNotifiedEvents } = eventsStore();
  const { notifications, setNotifications } = notificationsStore();

  const checkUpcomingEvents = async () => {
    const now = new Date();
    const upcomingEvents = events.filter((event) => {
      const eventStart = new Date(`${event.date}T${event.startTime}`);
      const timeDiff = (eventStart.getTime() - now.getTime()) / (1000 * 60);
      return (
        timeDiff > 0 &&
        timeDiff <= event.notificationTime &&
        !notifiedEvents.includes(event.id)
      );
    });

    for (const event of upcomingEvents) {
      try {
        setNotifications((prev) => [
          ...prev,
          {
            id: event.id,
            message: `${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`,
          },
        ]);
        setNotifiedEvents((prev) => [...prev, event.id]);
      } catch (error) {
        console.error("Error updating notification status:", error);
      }
    }
  };

  useInterval(checkUpcomingEvents, 1000); // 1초마다 체크

  return (
    <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
      {notifications.map((notification, index) => (
        <Alert key={index} status="info" variant="solid" width="auto">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
          </Box>
          <CloseButton
            onClick={() =>
              setNotifications((prev) => prev.filter((_, i) => i !== index))
            }
          />
        </Alert>
      ))}
    </VStack>
  );
};
