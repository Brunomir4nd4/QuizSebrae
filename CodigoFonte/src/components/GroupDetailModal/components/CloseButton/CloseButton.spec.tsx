import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CloseButton } from "./CloseButton.component";

describe("CloseButton component", () => {
  it("renders the button correctly", () => {
    const mockRemove = jest.fn();
    render(<CloseButton removeParticipant={mockRemove} />);
    
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("calls removeParticipant on click", () => {
    const mockRemove = jest.fn();
    render(<CloseButton removeParticipant={mockRemove} />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockRemove).toHaveBeenCalledTimes(1);
  });
});
