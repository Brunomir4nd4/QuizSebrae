import { render, screen } from "@testing-library/react";
import React from "react";
import { ConsultancyConfirmed } from "./ConsultancyConfirmed.component";
import * as hooks from "@/hooks";
import { useSession } from "next-auth/react";
import Link from "next/link";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock("@/hooks", () => ({
  getDateObject: jest.fn(),
}));

describe("ConsultancyConfirmed component", () => {
  const mockDateObject = {
    dayName: "Segunda",
    dayNumber: "15",
    mounthName: "Agosto",
    hour: "14:00",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (hooks.getDateObject as jest.Mock).mockReturnValue(mockDateObject);
  });

	it("renders date correctly", () => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { id: "123" } } });
    render(
      <ConsultancyConfirmed
        start_datetime="2025-08-15T14:00:00"
        classId="1"
        is_group_meetings_enabled={false}
      />
    );
    expect(screen.getByText("Segunda")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("14:00h")).toBeInTheDocument();
    expect(screen.getByText("Seu horário")).toBeInTheDocument();
  });

	it("renders link for individual consultancy when group disabled", () => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { id: "123" } } });
    render(
      <ConsultancyConfirmed
        start_datetime="2025-08-15T14:00:00"
        classId="1"
        is_group_meetings_enabled={false}
      />
    );
    const link = screen.getByRole("link") as HTMLAnchorElement;
    expect(link.href).toContain("/consultoria/1-123");
  });

	it("renders link for group when enabled and meeting_id provided", () => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { id: "123" } } });
    render(
      <ConsultancyConfirmed
        start_datetime="2025-08-15T14:00:00"
        classId="1"
        is_group_meetings_enabled={true}
        meeting_id="456"
      />
    );
    const link = screen.getByRole("link") as HTMLAnchorElement;
    expect(link.href).toContain("/grupo/1-456");
  });

	it("does not render link when there is no session", () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(
      <ConsultancyConfirmed
        start_datetime="2025-08-15T14:00:00"
        classId="1"
        is_group_meetings_enabled={true}
        meeting_id="456"
      />
    );
    expect(screen.queryByRole("link")).toBeNull();
  });
});
