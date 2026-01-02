/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { CancelModal } from "./CancelModal.component";

const mockSetSchedule = jest.fn();
const mockOnClose = jest.fn();
const mockMainModalClose = jest.fn();
const mockDeleteBookingById = jest.fn();

jest.mock("@/app/providers/ScheduleProvider", () => ({
  useScheduleContext: () => ({
    setSchedule: mockSetSchedule,
  }),
}));

jest.mock("@/app/services/bff/ScheduleService", () => ({
  deleteBookingById: (...args: any[]) => mockDeleteBookingById(...args),
}));

jest.mock("../BaseModal", () => ({
  BaseModal: ({ open, header, footer, children }: any) => (
    <div data-testid="base-modal">
      {header}
      {children}
      {footer}
    </div>
  ),
}));

describe("CancelModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with title and attention", () => {
    render(
      <CancelModal
        open={true}
        onClose={mockOnClose}
        mainModalClose={mockMainModalClose}
        class_id="class1"
        booking_id="1"
      />
    );

    
    expect(screen.getByText(/Tem certeza de que deseja cancelar/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Confirmar/i })).toBeInTheDocument();
  });

  it("executes deleteBooking and calls callbacks when confirms", async () => {
    mockDeleteBookingById.mockResolvedValueOnce({
      status: 200,
      data: { id: "1", start_time: "2025-08-15 10:00", finish_time: "2025-08-15 11:00", class_id: "class1", employee_id: 1 },
    });

    render(
      <CancelModal
        open={true}
        onClose={mockOnClose}
        mainModalClose={mockMainModalClose}
        class_id="class1"
        booking_id="1"
      />
    );

    const confirmBtn = screen.getByRole("button", { name: /Confirmar/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockDeleteBookingById).toHaveBeenCalledWith("1");
      expect(mockSetSchedule).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockMainModalClose).toHaveBeenCalled();
    });
  });

  it("supports booking_id as array", async () => {
    mockDeleteBookingById.mockResolvedValue({
      status: 200,
      data: { id: "1", start_time: "2025-08-15 10:00", finish_time: "2025-08-15 11:00", class_id: "class1", employee_id: 1 },
    });

    render(
      <CancelModal
        open={true}
        onClose={mockOnClose}
        mainModalClose={mockMainModalClose}
        class_id="class1"
        booking_id={["1", "2"]}
      />
    );

    const confirmBtn = screen.getByRole("button", { name: /Confirmar/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockDeleteBookingById).toHaveBeenCalledTimes(2);
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockMainModalClose).toHaveBeenCalled();
    });
  });
});
