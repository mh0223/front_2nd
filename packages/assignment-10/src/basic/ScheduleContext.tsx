import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleContextType {
  getSchedules: (tableId: string) => Schedule[];
  updateSchedules: (tableId: string, newSchedules: Schedule[]) => void;
  getAllTableIds: () => string[];
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const getSchedules = useCallback(
    (tableId: string) => schedulesMap[tableId] || [],
    [schedulesMap]
  );

  const updateSchedules = useCallback(
    (tableId: string, newSchedules: Schedule[]) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: newSchedules,
      }));
    },
    []
  );

  const getAllTableIds = useCallback(
    () => Object.keys(schedulesMap),
    [schedulesMap]
  );

  const contextValue = useMemo(
    () => ({
      getSchedules,
      updateSchedules,
      getAllTableIds,
    }),
    [getSchedules, updateSchedules, getAllTableIds]
  );

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
    </ScheduleContext.Provider>
  );
};
