'use client'

import React, { FunctionComponent, useState } from 'react';
import { styled } from '@mui/system';
import { DateTime, WeekdayNumbers } from 'luxon';
import { ModalBlockTime } from '@/components/ModalBlockTime/ModalBlockTime.component';
import { blockScheduleTimeBff } from "@/app/services/bff/ScheduleService";
import { useSession } from "next-auth/react";
import { ScheduleSlotContent } from "../../ScheduleSlot/ScheduleSlot.styles";
import { IconEventBlock } from "@/resources/icons";
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
    "&:nth-of-type(1)": {
      minWidth: "var(--schedule-first-slot-width)",
      width: "var(--schedule-first-slot-width)",
      maxWidth: "var(--schedule-first-slot-width)",
      fontSize: "24px",
      fontWeight: "bold",
    },
    "&:nth-of-type(n+2)": {
      width: "calc(100% / 7)",
    },
    "&:nth-last-of-type(1)": {
      "--line-color": "rgba(168, 172, 179, .2)",
      backgroundImage:
        "repeating-linear-gradient(-45deg, var(--line-color), var(--line-color) 2px, transparent 2px, transparent 6px)",
      backgroundPosition: "center",
    },
    "&:nth-last-of-type(2)": {
      "--line-color": "rgba(168, 172, 179, .2)",
      backgroundImage:
        "repeating-linear-gradient(-45deg, var(--line-color), var(--line-color) 2px, transparent 2px, transparent 6px)",
      backgroundPosition: "center",
    },
  },
});

const SlotCell = styled("td")({
  borderLeft: "1px solid var(--schedule-slots-vertical-border-color)",
  position: "relative",
  "&:hover": {
    backgroundColor: "rgba(110, 112, 122, 0.2)",
    borderColor: "transparent",
    color: "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
    pointerEvents: "auto",
    fontSize: "16px",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    "& > div:nth-of-type(1)": {
      opacity: "0",
    },
    "& > div:nth-of-type(2)": {
      opacity: "0.8",
    },
  },
  "& > div:nth-of-type(1)": {
    height: "1px",
    backgroundImage:
      "linear-gradient(to right, var(--schedule-slots-horizontal-border-color) 50%, transparent 50%)",
    backgroundSize: "6px 1px",
  },
  "& > div:nth-of-type(2)": {
    position: "absolute",
    top: "50%",
    left: "0",
    transform: "translateY(-50%)",
    paddingLeft: "20px",
    opacity: "0",
    "svg path, svg rect": {
      stroke: "rgba(0,0,0,0.5)",
    },
    h1: {
      color: "rgba(0,0,0,0.5)",
    },
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
}

export const WeekSlots: FunctionComponent<WeekSlotsProps> = ({
  start,
  end,
  children,
  weekStart,
}: WeekSlotsProps) => {
  const weekDays = 7;
  let hours = [];

  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState({
    start_date_time: "",
    end_date_time: "",
    time_blocked: "true",
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
        {Array.from({ length: weekDays }).map((_, col, index) => (
          <SlotCell key={col} onClick={() => handleClick(col + 1, hour)}>
            <div></div>
            <ScheduleSlotContent>
              <IconEventBlock />
              <h1>Bloquear</h1>
            </ScheduleSlotContent>
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
          {/* {Array.from({ length: (weekDays - 1) * hours.length }).map((_, index) => (
                    <div key={index}>{index+1}</div>
                ))} */}
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