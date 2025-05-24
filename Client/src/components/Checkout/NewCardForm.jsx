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
        return { ...values, isNew: true, cardid: 'new_card_checkout' };
      } catch (info) {
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
        <label htmlFor="newCard_cardholderName">Cardholder Name</label>
        <Form.Item
          name="cardholderName"
        >
          <Input placeholder="Cardholder Name" id="newCard_cardholderName" />
        </Form.Item>

        <label htmlFor="newCard_cardNumber">Card Number</label>
        <Form.Item
          name="cardNumber"
        >
          <Input placeholder="0000 0000 0000 0000" id="newCard_cardNumber" />
        </Form.Item>

        <label htmlFor="newCard_expiryDate">Expiry Date (MM/YY)</label>
        <Form.Item
          name="expiryDate"
          rules={[
          ]}
        >
          <Input placeholder="MM/YY" id="newCard_expiryDate" />
        </Form.Item>

        <label htmlFor="newCard_cvv">CVV</label>
        <Form.Item
          name="cvv"
        >
          <Input placeholder="123" id="newCard_cvv" />
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