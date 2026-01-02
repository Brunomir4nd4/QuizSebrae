'use client'

import React, { FunctionComponent, useState } from 'react';
import { styled } from '@mui/system';
import { useSession } from 'next-auth/react';
import { DateTime, WeekdayNumbers } from 'luxon';
import { ModalBlockTime } from '@/components/ModalBlockTime';
import { blockScheduleTimeBff } from "@/app/services/bff/ScheduleService";
import { useUserContext } from "@/app/providers/UserProvider";
import { Loader } from "@/components/Loader";

const SlotsHolder = styled("div")({
  position: "relative",
  zIndex: 1,
});

const SlotsTable = styled("table")({
  "& tr": {
    height: "var(--schedule-slot-height)",
    borderTop: "1px solid var(--schedule-slots-horizontal-border-color)",
    borderBottom: "1px solid var(--schedule-slots-horizontal-border-color)",
  },
  "& td": {
    cursor: "pointer",
    "&:nth-of-type(1)": {
      width: "var(--schedule-first-slot-width)",
      fontSize: "24px",
      fontWeight: "bold",
    },
    "&:hover": {
      backgroundColor: "rgba(110, 112, 122, 0.2)",
      borderColor: "transparent",
      color: "rgba(255, 255, 255, 0.5)",
      cursor: "pointer",
      pointerEvents: "auto",
      fontSize: "16px",
      border: "1px solid var(--border-color)",
      borderRadius: "10px",
    },
  },
});

const SlotCell = styled("td")({
  borderLeft: "1px solid var(--schedule-slots-vertical-border-color)",
  "&:hover": {
    backgroundColor: "#f2f2f2",
  },
  div: {
    height: "1px",
    backgroundImage:
      "linear-gradient(to right, var(--schedule-slots-horizontal-border-color) 50%, transparent 50%)",
    backgroundSize: "6px 1px",
  },
});

const SlotsEvents = styled("div")({
  position: "absolute",
  display: "grid",
  gridAutoFlow: "column dense",
  gap: "6px",
  top: 0,
  left: "var(--schedule-first-slot-width)",
  right: 0,
  bottom: 0,
  padding: "3px",
  pointerEvents: "none",
});

export interface WeekSlotsProps {
  start: number;
  end: number;
  children?: React.ReactNode;
  weekStart: DateTime<boolean>;
  currentDay: DateTime<true> | DateTime<false>;
}

export const DaySlots: FunctionComponent<WeekSlotsProps> = ({
  start,
  end,
  children,
  weekStart,
  currentDay,
}: WeekSlotsProps) => {
  const weekDays = 1;
  let hours = [];

  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState({
    start_date_time: "",
    end_date_time: "",
    time_blocked: "",
  });
  const session = useSession();
  const { classId } = useUserContext();

  if (!classId) {
    return <Loader />;
  }

  const handleClick = (day: number, hour: number) => {
    const date = DateTime.fromObject({
      weekNumber: weekStart.weekNumber,
      weekday: day as WeekdayNumbers,
    });
    const formattedStartTime = DateTime.fromObject({ hour: hour }).toFormat(
      "HH:mm:ss",
    );
    const formattedEndTime = DateTime.fromObject({ hour: hour + 1 }).toFormat(
      "HH:mm:ss",
    );

    setOpen(true);

    setPayload({
      start_date_time: `${date.toISODate()} ${formattedStartTime}`,
      end_date_time: `${date.toISODate()} ${formattedEndTime}`,
      time_blocked: "true",
    });
  };

  for (let hour = start; hour <= end; hour++) {
    hours.push(
      <tr key={hour}>
        <td>{hour < 10 ? `0${hour}` : hour}:00</td>
        {Array.from({ length: weekDays }).map((_, col) => (
          <SlotCell
            key={col}
            onClick={() => handleClick(currentDay.weekday, hour)}
          >
            <div></div>
          </SlotCell>
        ))}
      </tr>,
    );
  }

  return (
    <>
      <SlotsHolder>
        <SlotsTable className="w-full">
          <tbody>{hours}</tbody>
        </SlotsTable>
        <SlotsEvents
          style={{
            gridTemplateColumns: `repeat(${weekDays}, 1fr)`,
            gridTemplateRows: `repeat(${hours.length * 2}, 1fr)`,
          }}
        >
          {Array.from({ length: (weekDays - 1) * hours.length }).map(
            (_, index) => (
              <div key={index}>{index + 1}</div>
            ),
          )}
          {children}
        </SlotsEvents>
      </SlotsHolder>
      {session.data && (
        <ModalBlockTime
          blockTime={payload}
          open={open}
          onClose={() => setOpen(false)}
          blockCallback={async () =>
            await blockScheduleTimeBff({
              start_time: payload.start_date_time,
              finish_time: payload.end_date_time,
              class_id: classId,
            })
          }
          type={"block"}
        />
      )}
    </>
  );
};