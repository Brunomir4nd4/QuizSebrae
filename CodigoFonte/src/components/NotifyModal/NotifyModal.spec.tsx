import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/providers/UserProvider";
import { signOut } from "next-auth/react";
import { datadogRum } from "@datadog/browser-rum";
import { NotifyModal } from "./NotifyModal.component";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/app/providers/UserProvider", () => ({
    useUserContext: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
    signOut: jest.fn(),
}));

jest.mock("@datadog/browser-rum", () => ({
    datadogRum: {
        clearUser: jest.fn(),
    },
}));

const mockReplace = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
    replace: mockReplace,
    back: jest.fn(),
});

const mockThemeSettings = {
    themeSettings: { whatsapp_support_link: "https://wa.me/12345" },
};

(useUserContext as jest.Mock).mockReturnValue(mockThemeSettings);

describe("NotifyModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders title, highlight and message", () => {
        render(
            <NotifyModal
                title="Título"
                highlight="Importante"
                message="Mensagem de teste"
                logout={false}
            />
        );

        expect(screen.getByText(/Importante/i)).toBeInTheDocument();
        expect(screen.getByText(/Título/i)).toBeInTheDocument();
        expect(screen.getByText(/Mensagem de teste/i)).toBeInTheDocument();
    });

    it("opens WhatsApp link when 'whats' is true", () => {
        render(
            <NotifyModal
                title="Teste"
                message="Msg"
                logout={false}
                whats
            />
        );

        const link = screen.getByText(/Chama no Whats/i).closest("a");
        expect(link).toHaveAttribute("href", "https://wa.me/12345");
    });

    it("calls reload when 'reload' is true", () => {
        Object.defineProperty(window, "location", {
            value: { reload: jest.fn() },
            writable: true,
        });

        render(
            <NotifyModal
                title="Teste"
                message="Msg"
                logout={false}
                reload
            />
        );

        fireEvent.click(screen.getByText(/Tentar novamente/i));
        expect(window.location.reload).toHaveBeenCalled();
    });

    it("executes callback and backOnClose when closing modal", () => {
        const mockCallback = jest.fn();
        const mockBack = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            replace: jest.fn(),
            back: mockBack,
        });

        render(
            <NotifyModal
                title="Teste"
                message="Msg"
                logout={false}
                callback={mockCallback}
                backOnClose
            />
        );

        fireEvent.click(screen.getByRole("button", { hidden: true }));
        expect(mockCallback).toHaveBeenCalled();
        expect(mockBack).toHaveBeenCalled();
    });

    it("executes logout correctly", async () => {
        const mockReplace = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            replace: mockReplace,
            back: jest.fn(),
        });

        (signOut as jest.Mock).mockResolvedValue(undefined);

        render(
            <NotifyModal
                title="Logout"
                message="Msg"
                logout
            />
        );

        await act(async () => {

            fireEvent.click(screen.getByRole("button", { hidden: true }));
        });

        expect(signOut).toHaveBeenCalledWith({ redirect: true });


        await waitFor(() => {
            expect(datadogRum.clearUser).toHaveBeenCalled();
            expect(mockReplace).toHaveBeenCalledWith("/");
        });
    });
});
