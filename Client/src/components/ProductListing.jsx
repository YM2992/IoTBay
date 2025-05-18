import "../pages/MainPage.css";
import "./ProductListing.css";
import { Link } from "react-router-dom";

import { Button, Card, ConfigProvider } from "antd";
const { Meta } = Card;
import { createStyles } from "antd-style";
import { getImageSrc } from "@/utils/helper";

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

function ProductListing({ data }) {
  const { styles } = useStyle();
  const { name, image, price, productid } = data;

  return (
    <>
      <Card
        style={{ width: 400, backgroundColor: "#F1F1F1" }}
        cover={
          <img
            className="product-image"
            style={{ border: "1px solid #F1F1F1", borderRadius: "5px" }}
            src={getImageSrc(image)}
            alt={name}
          />
        }
        actions={[
          <ConfigProvider
            key="Detail"
            button={{
              className: styles.linearGradientButton,
            }}
            style={{ backgroundColor: "#F1F1F1" }}
          >
            <Link to={`/products/${productid}`}>
              <Button type="primary" size="large">
                See Details
              </Button>
            </Link>
          </ConfigProvider>,
        ]}
      >
        <Meta title={name} description={`$${price.toFixed(2)}`} />
      </Card>
    </>
  );
}

export default ProductListing;
