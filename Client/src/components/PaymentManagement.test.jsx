import React from "react";
import { test, expect, describe } from "vitest";

import { render, screen } from "@testing-library/react";
import SavedPaymentInfo from "./SavedPaymentInfo";


const mockPaymentInfo = {
  cardNumber: "9999 8888 7777 6666",
  cardholderName: "John Doe",
  expiryDate: "12/25",
  cvv: "931",
};

describe("SavedPaymentInfo Component", () => {
  test("add new payment details", () => {
    render(<SavedPaymentInfo paymentInfo={null} />);

    expect(screen.getByText(/Save Payment/)).toBeDefined();
  });

  test("see saved payment details", () => {
    render(<SavedPaymentInfo paymentInfo={mockPaymentInfo} />);
    
    expect(screen.getByText("Saved Payment Details")).toBeDefined();
    expect(screen.getByDisplayValue(mockPaymentInfo.cardNumber)).toBeDefined();
    expect(screen.getByDisplayValue(mockPaymentInfo.cardholderName)).toBeDefined();
    expect(screen.getByDisplayValue(mockPaymentInfo.expiryDate)).toBeDefined();
    expect(screen.getByDisplayValue(mockPaymentInfo.cvv)).toBeDefined();
    expect(screen.getByText(/Update Payment/)).toBeDefined();
  });

  test("remove saved payment details", () => {
    render(<SavedPaymentInfo paymentInfo={mockPaymentInfo} />);

    const removeButton = screen.getByRole("remove-payment");
    expect(removeButton).toBeDefined();

    removeButton.click();

    expect(screen.queryByDisplayValue(mockPaymentInfo.cardNumber)).toBeNull();
    expect(screen.queryByDisplayValue(mockPaymentInfo.cardholderName)).toBeNull();
    expect(screen.queryByDisplayValue(mockPaymentInfo.expiryDate)).toBeNull();
    expect(screen.queryByDisplayValue(mockPaymentInfo.cvv)).toBeNull();
  });
});