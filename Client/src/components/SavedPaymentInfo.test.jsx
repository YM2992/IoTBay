import React from 'react';
import { test, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import SavedPaymentInfo from './SavedPaymentInfo';


const mockPaymentInfo = {
  cardNumber: '**** **** **** 1234',
  cardHolderName: 'John Doe',
  expiryDate: '12/25',
  cvv: '***',
};

test('see saved payment details', () => {

  render(<SavedPaymentInfo paymentInfo={mockPaymentInfo} />);

  const linkElement = screen.getByText("Saved Payment Details");

  expect(linkElement).toBeInTheDocument();

});