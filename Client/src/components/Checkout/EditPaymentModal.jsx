import React from 'react';
import { Modal, Form, Input } from 'antd';
import './EditPaymentModal.css'; // Create this CSS file for styling

const EditPaymentModal = ({ open, onOk, onCancel, form }) => {
  return (
    <Modal
      title="Edit Payment Method"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Save Changes"
      destroyOnHidden
      className="edit-card-modal-form"
    >
      <Form 
        form={form}
        name="edit_card_form"
        layout="vertical"
      >
        <label htmlFor="editPayment_cardholderName">Cardholder Name</label>
        <Form.Item
          name="cardholderName"
        >
          <Input placeholder="First Last" id="editPayment_cardholderName"/>
        </Form.Item>

        <label htmlFor="editPayment_cardNumber">Card Number</label>
        <Form.Item
          name="cardNumber"
        >
          <Input placeholder="1234 5678 9123 4567" id="editPayment_cardNumber" />
        </Form.Item>

        <label htmlFor="editPayment_expiryDate">Expiry Date (MM/YY)</label>
        <Form.Item
          name="expiryDate"
        >
          <Input placeholder="MM/YY" id="editPayment_expiryDate" />
        </Form.Item>

        <label htmlFor="editPayment_cvv">CVV</label>
        <Form.Item
          name="cvv"
        >
          <Input placeholder="123" id="editPayment_cvv" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPaymentModal;