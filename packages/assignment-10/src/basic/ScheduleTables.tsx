import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { memo, useCallback, useMemo, useState } from "react";

export const ScheduleTables = memo(() => {
  const { getAllTableIds, getSchedules, updateSchedules } =
    useScheduleContext();

  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const tableIds = useMemo(() => getAllTableIds(), [getAllTableIds]);

  const disabledRemoveButton = useMemo(() => tableIds.length === 1, [tableIds]);

  const duplicate = useCallback(
    (targetId: string) => {
      const newTableId = `schedule-${Date.now()}`;
      const schedulesToDuplicate = getSchedules(targetId);
      updateSchedules(newTableId, [...schedulesToDuplicate]);
    },
    [getSchedules, updateSchedules]
  );

  const remove = useCallback(
    (targetId: string) => {
      const updatedTableIds = tableIds.filter((id) => id !== targetId);
      if (updatedTableIds.length > 0) {
        updateSchedules(targetId, []); // Clear the schedules for the removed table
      }
    },
    [tableIds, updateSchedules]
  );

  const handleScheduleTimeClick = useCallback(
    (tableId: string, timeInfo: { day: string; time: number }) => {
      setSearchInfo({ tableId, ...timeInfo });
    },
    []
  );

  const handleDeleteButtonClick = useCallback(
    (tableId: string, { day, time }: { day: string; time: number }) => {
      const currentSchedules = getSchedules(tableId);
      const updatedSchedules = currentSchedules.filter(
        (schedule) => schedule.day !== day || !schedule.range.includes(time)
      );
      updateSchedules(tableId, updatedSchedules);
    },
    [getSchedules, updateSchedules]
  );

  const renderScheduleTables = useMemo(
    () =>
      tableIds.map((tableId, index) => {
        const schedules = getSchedules(tableId);
        return (
          <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">
                시간표 {index + 1}
              </Heading>
              <ButtonGroup size="sm" isAttached>
                <Button
                  colorScheme="green"
                  onClick={() => setSearchInfo({ tableId })}
                >
                  시간표 추가
                </Button>
                <Button
                  colorScheme="green"
                  mx="1px"
                  onClick={() => duplicate(tableId)}
                >
                  복제
                </Button>
                <Button
                  colorScheme="green"
                  isDisabled={disabledRemoveButton}
                  onClick={() => remove(tableId)}
                >
                  삭제
                </Button>
              </ButtonGroup>
            </Flex>
            <ScheduleTable
              key={`schedule-table-${tableId}`}
              schedules={schedules}
              tableId={tableId}
              onScheduleTimeClick={(timeInfo) =>
                handleScheduleTimeClick(tableId, timeInfo)
              }
              onDeleteButtonClick={(timeInfo) =>
                handleDeleteButtonClick(tableId, timeInfo)
              }
            />
          </Stack>
        );
      }),
    [
      tableIds,
      getSchedules,
      duplicate,
      remove,
      disabledRemoveButton,
      handleScheduleTimeClick,
      handleDeleteButtonClick,
    ]
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {renderScheduleTables}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={useCallback(() => setSearchInfo(null), [])}
      />
    </>
  );
});
