import { Button, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { Lecture } from "./types";
import { memo, useMemo } from "react";
import { PAGE_SIZE } from "./constants";

type LectureItemProps = {
  lecture: Lecture;
  index: number;
  handleAddSchedule: (lecture: Lecture) => void;
};

const LectureItem = memo(
  ({ lecture, index, handleAddSchedule }: LectureItemProps) => {
    return (
      <Tr key={`${lecture.id}-${index}`}>
        <Td width="100px">{lecture.id}</Td>
        <Td width="50px">{lecture.grade}</Td>
        <Td width="200px">{lecture.title}</Td>
        <Td width="50px">{lecture.credits}</Td>
        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
        <Td
          width="150px"
          dangerouslySetInnerHTML={{ __html: lecture.schedule }}
        />
        <Td width="80px">
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => handleAddSchedule(lecture)}
          >
            추가
          </Button>
        </Td>
      </Tr>
    );
  }
);

type LectureListProps = {
  lectures: Lecture[];
  page: number;

  handleAddSchedule: (lecture: Lecture) => void;
};

export const LectureList = ({
  lectures,
  page,
  handleAddSchedule,
}: LectureListProps) => {
  const visibleLectures = useMemo(
    () => lectures.slice(0, page * PAGE_SIZE),
    [lectures, page]
  );

  return (
    <Table size="sm" variant="striped">
      <Tbody>
        {visibleLectures.map((lecture: Lecture, index: number) => (
          <LectureItem
            key={`lectureItem-${lecture.id}-${index}`}
            lecture={lecture}
            index={index}
            handleAddSchedule={handleAddSchedule}
          />
        ))}
      </Tbody>
    </Table>
  );
};
