import React from "react";
import { test, expect, describe } from "vitest";

import { render, screen } from "@testing-library/react";
import SavedPaymentInfo from "./SavedPaymentInfo";


const mockPaymentInfo = {
  cardNumber: "**** **** **** 1234",
  cardholderName: "John Doe",
  expiryDate: "12/25",
  cvv: "***",
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
});