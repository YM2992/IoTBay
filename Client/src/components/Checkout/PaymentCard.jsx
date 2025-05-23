import React, { useState } from 'react';
import { Radio, Button, Typography, Form } from 'antd';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import EditPaymentModal from './EditPaymentModal'; // Import the modal
import { savePaymentCard } from '@/components/Payment'; // Import the API function
import './PaymentCard.css';
import { getExpiryDateStatus } from '@/utils/helper';

const { Text } = Typography;

const PaymentCard = ({ card, token, onCardUpdated }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  const showEditModalHandler = () => {
    editForm.setFieldsValue({
      cardholderName: card.cardholderName,
      expiryDate: card.expiryDate,
      cardNumber: card.cardNumber || "",
      cvv: card.cvv || "",
    });
    setIsEditModalVisible(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
  };

  const handleSaveEditedCard = async () => {
    try {
      const values = await editForm.validateFields();
      const cardDataToUpdate = {
        cardid: card.cardid,
        cardholderName: values.cardholderName,
        expiryDate: values.expiryDate,
        cardNumber: values.cardNumber,
        cvv: values.cvv,
      };

      const response = await savePaymentCard(cardDataToUpdate, token);

      if (response && response.status === "success") {
        toast.success(response.message || "Payment method updated successfully!");
        if (onCardUpdated) {
          onCardUpdated(); // refresh the card list in CheckoutPage
        }
        handleCancelEdit(); // close modal and reset form
      } else {
        toast.error(response?.message || "Failed to update payment method.");
      }
    } catch (errorInfo) {
      toast.error(errorInfo.message || "Failed to update. Please check details.");
      console.log("Edit Card Save Failed (Other):", errorInfo);
    }
  };

  return (
    <>
      <Radio value={`saved_${card.cardid}`}>
        <div className="payment-card-content-wrapper">
          <div>
            <Text>Card ending in **** {card.cardNumber ? card.cardNumber.slice(-4) : 'N/A'}</Text>
            <br/>
            <Text type="secondary" style={{fontSize: '0.9em'}}>{card.cardholderName}</Text>
            <br/>
            {getExpiryDateStatus(card.expiryDate) === "Expired" ? (
              <Text type="danger" style={{fontSize: '0.9em'}}>Expired on {card.expiryDate}</Text>
            ) : (
              <Text type="success" style={{fontSize: '0.9em'}}>Valid until {card.expiryDate}</Text>
            )}
          </div>
          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              showEditModalHandler();
            }}
            className="edit-card-button"
          >
            Edit
          </Button>
        </div>
      </Radio>
      <EditPaymentModal
        open={isEditModalVisible}
        onOk={handleSaveEditedCard}
        onCancel={handleCancelEdit}
        form={editForm}
      />
    </>
  );
};

PaymentCard.propTypes = {
  card: PropTypes.shape({
    cardid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    cardholderName: PropTypes.string,
    cardNumber: PropTypes.string,
    expiryDate: PropTypes.string,
    cvv: PropTypes.string,
  }).isRequired,
  token: PropTypes.string,
  onCardUpdated: PropTypes.func,
};

export default PaymentCard;