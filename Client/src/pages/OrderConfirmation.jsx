import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography, Result } from 'antd';
import './OrderConfirmation.css';
import { getImageSrc } from '@/utils/helper';

const { Title, Text } = Typography;

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderid, totalAmount, products } = location.state || {};

  console.log(location.state);

  if (!orderid || totalAmount === undefined) {
    // Redirect to home if state is not properly passed
    navigate('/');
    return null; 
  }

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <div className="order-confirmation-container">
      <Result
        status="success"
        title="Your order is confirmed!"
        subTitle={`Total Amount: $${parseFloat(totalAmount).toFixed(2)}`}
        extra={[
          <Button type="primary" key="continue" onClick={handleContinueShopping}>
            Continue Shopping
          </Button>,
          <Button key="view-orders" onClick={() => navigate('/profile?tab=orders')}>
            View My Orders
          </Button>
        ]}
      >
        {products && products.length > 0 && (
          <div className="product-summary">
            <Title level={4}>Order Summary</Title>
            {products.map((product, index) => (
              <div key={index} className="product-item-summary">
                {product.image && (
                  <img 
                    src={getImageSrc(product.image)} 
                    alt={product.name || `Product ${product.productid}`} 
                    className="product-summary-image" 
                  />
                )}
                <div className="product-details-summary">
                  <Text strong>{product.name || `Product ID: ${product.productid}`}</Text>
                  <Text>Quantity: {product.quantity}</Text>
                  <Text>Price: ${parseFloat(product.price).toFixed(2)}</Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </Result>
    </div>
  );
}

export default OrderConfirmation;