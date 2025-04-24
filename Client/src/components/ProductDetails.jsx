import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../main";
import { useParams } from "react-router-dom";

import { Image, Statistic, Button, Flex, InputNumber, Divider, Layout, Card } from "antd";

import { contentStyle, siderStyle, layoutStyle } from "./productLayout";

const { Sider, Content } = Layout;

function ProductDetails() {
  const { productid } = useParams();
  const { products } = useContext(AuthContext);
  const [data, setData] = useState();

  useEffect(() => {
    const product = products.find((element) => element.productid === Number(productid));
    setData(product);
  }, [products, data]);

  if (!products || products.length === 0) return <p>Loading</p>;

  return (
    <>
      {!data && <p>loading...</p>}

      {data && (
        <div style={{ width: "100%", position: "related", top: "1rem" }}>
          <Layout style={layoutStyle}>
            <Layout style={{ background: "transparent" }}>
              <Content style={contentStyle}>
                <Image style={{ width: "100%" }} src={`/assets/products/${data.image}.jpg`} />

                <Divider />
                <Card
                  title="Details"
                  variant="borderless"
                  style={{
                    background: "transparent",
                    color: "white",
                    fontSize: "1.5rem",
                    padding: "2rem",
                  }}
                >
                  <p style={{ textAlign: "left" }}>{data.description}</p>
                </Card>
              </Content>
            </Layout>
            <Sider width="25%" style={siderStyle}>
              <Flex gap="middle" vertical style={{ position: "sticky", top: "3rem" }}>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.name}</p>
                <p style={{ fontSize: "1.25rem" }}>${data.price}</p>

                <Flex horizontal style={{ padding: "2rem", justifyContent: "space-between" }}>
                  <Flex>
                    <InputNumber
                      min={1}
                      max={data.quantity}
                      defaultValue={1}
                      style={{ marginRight: "0.5rem" }}
                    />
                    <p style={{ lineHeight: "2rem" }}> / {data.quantity}</p>
                  </Flex>
                  <Button type="primary" disabled={data.quantity === 0}>
                    Add to Cart
                  </Button>
                </Flex>
              </Flex>
            </Sider>
          </Layout>
        </div>
      )}
    </>
  );
}

export default ProductDetails;
