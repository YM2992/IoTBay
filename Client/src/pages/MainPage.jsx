import "./MainPage.css";
import ProductListing from "../components/ProductListing";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { useFetch } from "@/hook/useFetch";
import LoadingSpinner from "@/components/LoadingSpinner";

import { filterCompare, filterIncludes } from "@/utils/filter";

import { Layout, Space, Input, Button, Slider, InputNumber, Empty } from "antd";
const { Content, Sider } = Layout;
const { Search } = Input;

function ProductPage() {
  const { products } = useContext(AppContext);
  const { updateProducts } = useContext(AppContext);
  const { data, error, loading } = useFetch("product/");
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(1000);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const loaded = products && products.length > 1;

  // filter
  const filterMinPrice = searchParams.get("minPrice") || minValue;
  const filterMaxPrice = searchParams.get("maxPrice") || maxValue;
  const filterSearch = searchParams.get("name") || "all";

  function onSearch(e) {
    const input = e.trim();
    setSearchParams({ name: input, filterMinPrice, filterMaxPrice });
    setSearch(input);
  }

  function onChange(e) {
    onSearch(e.target.value);
    setSearch(e.target.value);
  }

  const onChangeRange = (newValue) => {
    const [min, max] = newValue;
    setMinValue(min);
    setMaxValue(max);
    setSearchParams({ minPrice: min, maxPrice: max, filterSearch });
  };

  const onChangeMin = (newValue) => {
    setMinValue(newValue);
    setSearchParams({ minPrice: newValue });
  };
  const onChangeMax = (newValue) => {
    setMaxValue(newValue);
    setSearchParams({ maxPrice: newValue });
  };

  const clearFilter = () => {
    setSearchParams({ maxPrice: "all" });
    setSearchParams({ search: "all" });
    setMinValue(1);
    setMaxValue(1000);
    setSearch("");
  };

  useEffect(() => {
    if (!loading && !error && data) {
      updateProducts(data);
    }
  }, [loading, error, data, updateProducts]);

  if (loading || !loaded || error) {
    return (
      <div className="main-container">
        <LoadingSpinner size="large" />
        {error && (
          <h3 style={{ color: "white", marginTop: "2rem" }}>
            There are some issues with the server, please refresh the page or come back later.
          </h3>
        )}
      </div>
    );
  }

  const productAfterMinPrice = filterCompare(products, filterMinPrice, "price");
  const productAfterMaxPrice = filterCompare(productAfterMinPrice, filterMaxPrice, "price", true);
  const productAfterSearch = filterIncludes(productAfterMaxPrice, filterSearch, "name");

  return (
    <Layout
      style={{
        padding: "24px 24px",
        width: "100%",
        gap: "1rem",
        backgroundColor: "rgba(13, 48, 91,0.8)",
      }}
    >
      <Sider width={300} style={{ backgroundColor: "rgba(3, 16, 39, 0.8)" }}>
        <Space
          direction="vertical"
          style={{ width: "80%", margin: "10%", position: "sticky", top: "5rem" }}
        >
          <Search
            placeholder="search product"
            onChange={onChange}
            onSearch={onSearch}
            value={search}
            enterButton
          />

          <Space
            direction="vertical"
            style={{ color: "white", backgroundColor: "rgb(20 40 78 / 80%)", padding: "1rem" }}
          >
            <h4>Filter by price</h4>
            <Slider
              railBg={"rgba(20, 40, 78, 0.9)"}
              min={1}
              minCount={1}
              maxCount={1000}
              max={1000}
              range={true}
              value={[minValue, maxValue]}
              onChange={onChangeRange}
            />
            <InputNumber
              addonBefore="min"
              min={1}
              max={maxValue}
              value={minValue}
              onChange={onChangeMin}
            />
            <InputNumber
              addonBefore="max"
              min={minValue}
              max={1000}
              value={maxValue}
              onChange={onChangeMax}
            />
          </Space>
          <Button onClick={clearFilter}>Clear filed</Button>
        </Space>
      </Sider>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          backgroundColor: "rgba(5, 24, 60, 0.9)",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Explore our product range</h1>
        <div className="button-container">
          {productAfterSearch.map((product, index) => (
            <ProductListing key={product.productid || index} data={product} />
          ))}
        </div>
        {productAfterSearch.length < 1 && (
          <Empty
            description={
              <p style={{ color: "white" }}>
                There is no product matches your requirement, try something different
              </p>
            }
          >
            <Button type="primary" onClick={clearFilter}>
              Reset filter
            </Button>
          </Empty>
        )}
      </Content>
    </Layout>
  );
}

export default ProductPage;
