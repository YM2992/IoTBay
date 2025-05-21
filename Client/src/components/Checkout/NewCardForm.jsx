import React, { forwardRef, useContext, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Checkbox } from 'antd';
import toast from 'react-hot-toast';
import './NewCardForm.css';
import { AppContext } from '@/context/AppContext';

const NewCardForm = forwardRef(({ initialDetails, onFormChange }, ref) => {
  const { token } = useContext(AppContext);

  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    async validateAndGetNewCardDetails() {
      try {
        const values = await form.validateFields();
        // Frontend validation for expiry date format and past date removed.
        // This validation should now primarily be handled by the backend.

        // The 'saveCard' value will be part of 'values' from form.validateFields()
        return { ...values, isNew: true, cardid: 'new_card_checkout' };
      } catch (info) {
        // Antd form validation errors (e.g. for required fields) will be displayed on the form items
        toast.error("Please ensure all new card details are correct.");
        return null;
      }
    },
    resetFields() {
      form.resetFields();
    }
  }));

  return (
    <div className="new-card-form-container">
      <h4>Enter New Card Details</h4>
      <Form
        form={form}
        layout="vertical"
        name="new_card_payment_form"
        initialValues={initialDetails}
        onValuesChange={onFormChange}
      >
        <Form.Item
          name="cardholderName"
          label="Cardholder Name"
        >
          <Input placeholder="Cardholder Name" />
        </Form.Item>
        <Form.Item
          name="cardNumber"
          label="Card Number"
        >
          <Input placeholder="0000 0000 0000 0000" />
        </Form.Item>
        <Form.Item
          name="expiryDate"
          label="Expiry Date (MM/YY)"
          rules={[
          ]}
        >
          <Input placeholder="MM/YY" />
        </Form.Item>
        <Form.Item
          name="cvv"
          label="CVV"
        >
          <Input placeholder="123" />
        </Form.Item>
        {token && (
          <Form.Item name="saveCard" valuePropName="checked" className="save-card-checkbox">
            <Checkbox>Save this card for future payments</Checkbox>
          </Form.Item>
        )}
      </Form>
    </div>
  );
});
NewCardForm.displayName = 'NewCardForm';

export default NewCardForm;