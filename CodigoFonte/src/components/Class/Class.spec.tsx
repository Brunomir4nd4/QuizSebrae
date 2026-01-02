import { render, screen } from "@testing-library/react";
import { Class } from "./Class.component";
import { useUserContext } from "@/app/providers/UserProvider";
import React from "react";

jest.mock("@/app/providers/UserProvider", () => ({
    useUserContext: jest.fn(),
}));

const mockClassesData = {
    class1: { title: "Turma A" },
};

describe("Class component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows loader if classesData or classId do not exist", () => {
        (useUserContext as jest.Mock).mockReturnValue({
            classesData: null,
            classId: null,
        });

        render(<Class href="/teste" buttonText="Mudar" />);

        expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    it("renders with context data when available", () => {
        (useUserContext as jest.Mock).mockReturnValue({
            classesData: mockClassesData,
            classId: "class1",
        });

        render(<Class href="/teste" buttonText="Mudar" />);

        expect(screen.getByText("Turma A")).toBeInTheDocument();
        const button = screen.getByRole("link");
        expect(button).toHaveAttribute("href", "/teste");
        expect(screen.getByText("Mudar")).toBeInTheDocument();
    });

    it("renders with name when classesData[classId] does not have a title", () => {
        (useUserContext as jest.Mock).mockReturnValue({
            classesData: { class1: {} },
            classId: "class1",
        });

        render(<Class href="/teste" buttonText="Mudar" name="Fallback Name" />);

        expect(screen.getByText("Fallback Name")).toBeInTheDocument();
    });

    it("adds query to link when query is provided", () => {
        (useUserContext as jest.Mock).mockReturnValue({
            classesData: mockClassesData,
            classId: "class1",
        });

        render(<Class href="/teste" buttonText="Mudar" query="prevPage" />);

        const button = screen.getByRole("link");
        expect(button).toHaveAttribute("href", "/teste?prev=prevPage");
    });

    it("adds 'small' or 'large' class correctly", () => {
        (useUserContext as jest.Mock).mockReturnValue({
            classesData: mockClassesData,
            classId: "class1",
        });

        const { rerender, container } = render(<Class href="/teste" buttonText="Mudar" small />);

        expect(container.firstChild).toHaveClass("small");

        rerender(<Class href="/teste" buttonText="Mudar" />);

        expect(container.firstChild).toHaveClass("large");
    });
});
