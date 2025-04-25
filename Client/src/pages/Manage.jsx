import { useFetchProduct } from "@/hook/useFetchProduct";
import { useContext, useEffect, useState } from "react";
import { Tabs } from "antd";

import ManageProduct from "@/components/ManageProduct";
import { AppContext } from "@/context/AppContext";

function Manage() {
  const [products, setProducts] = useState(null);
  const { token } = useContext(AppContext);
  const { data, error, loading, refetch } = useFetchProduct("product/all/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!loading || !error) setProducts(data);
  }, [data, loading, error]);

  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: "1",
      label: "Product",
      children: <ManageProduct data={products} refetch={refetch}></ManageProduct>,
    },
    {
      key: "2",
      label: "Tab 2",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <div className="profile-container">
      <h1>Manage</h1>
      <Tabs type="card" defaultActiveKey="1" items={items} size="large" centered />
    </div>
  );
}

export default Manage;
