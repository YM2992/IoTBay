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
      destroyOnClose // Ensures form fields are reset if not explicitly handled
      className="edit-card-modal-form"
    >
      <Form 
        form={form}
        name="edit_card_form"
        layout="vertical"
        style={{ maxWidth: 500 }}
        // initialValues will be set by form.setFieldsValue in the parent
      >
        <Form.Item
          name="cardholderName"
          label="Cardholder Name"
        >
          <Input placeholder="First Last"/>
        </Form.Item>
        <Form.Item
          name="cardNumber"
          label="Card Number"
        >
          <Input placeholder="1234 5678 9123 4567" />
        </Form.Item>
        <Form.Item
          name="expiryDate"
          label="Expiry Date (MM/YY)"
        >
          <Input placeholder="MM/YY" />
        </Form.Item>
        <Form.Item
          name="cvv"
          label="CVV"
        >
          <Input placeholder="123" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPaymentModal;