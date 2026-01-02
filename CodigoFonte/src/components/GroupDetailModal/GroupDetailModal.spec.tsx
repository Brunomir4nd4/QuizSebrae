import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { GroupDetailModal } from "./GroupDetailModal.component";
import { useUserContext } from "@/app/providers/UserProvider";
import { ScheduleEvent, ScheduleEventType } from "../Schedule/models/ScheduleEvent";
import { DateTime } from "luxon";

jest.mock("@/app/providers/UserProvider", () => ({
    useUserContext: jest.fn(),
}));

jest.mock("../CancelModal", () => ({
    CancelModal: ({ open }: any) => (open ? <div>CancelModal Open</div> : null),
}));

jest.mock("./components/RemoveParticipantModal", () => ({
    RemoveParticipantModal: ({ open }: any) => (open ? <div>RemoveParticipantModal Open</div> : null),
}));

describe("GroupDetailModal", () => {
    const mockClassesData = { 1: { title: "Turma 1" } };
    const mockClassId = "1";

    beforeEach(() => {
        (useUserContext as jest.Mock).mockReturnValue({
            classesData: mockClassesData,
            classId: mockClassId,
        });
    });

    const mockAppointment = new ScheduleEvent(
        "1",
        ScheduleEventType.Group,
        new Date("2025-08-15T10:00:00"),
        new Date("2025-08-15T10:15:00"),
        "Cliente Teste",
        "Roda de conversa",
        null,
        null,
        { id: 1, name: "Funcionario Teste", cpf: "12345678900", email: null, phone_number: null },
        "1",
        [
            {
                id: 101,
                start_time: "2025-08-15T10:00:00",
                finish_time: "2025-08-15T10:15:00",
                comments: "",
                additional_fields: null,
                class_id: "1",
                type_id: 1,
                client_id: 1,
                employee_id: 1,
                created_at: "2025-08-01T00:00:00",
                updated_at: "2025-08-01T00:00:00",
                deleted_at: null,
                client: { id: 1, name: "Cliente Teste", cpf: "12345678900", email: null, phone_number: null, created_at: "", updated_at: "", deleted_at: null },
                employee: { id: 1, name: "Funcionario Teste", cpf: "12345678900", email: null, phone_number: null, created_at: "", updated_at: "", deleted_at: null },
            }
        ]
    );

    it("renders modal with correct information", () => {
        render(<GroupDetailModal open={true} onClose={jest.fn()} appointment={mockAppointment} role="user" />);

        expect(
            screen.getByRole('heading', { level: 3, name: /Roda de conversa/i })
        ).toBeInTheDocument();
        expect(screen.getByText("10:00 - 10:15")).toBeInTheDocument();
        
        expect(screen.getByText(/Cliente Teste/)).toBeInTheDocument();
        
        expect(screen.getByText(/Entrar na sala/i)).toBeInTheDocument();

        expect(screen.getByText(/Cancelar mentoria/i)).toBeInTheDocument();
    });

    it("opens CancelModal when clicking cancel button", () => {
        render(<GroupDetailModal open={true} onClose={jest.fn()} appointment={mockAppointment} role="user" />);

        const cancelButton = screen.getByText(/Cancelar mentoria/i);
        fireEvent.click(cancelButton);

        expect(screen.getByText("CancelModal Open")).toBeInTheDocument();
    });
});
