import { useFetchProduct } from "@/hook/useFetchProduct";
import { useContext, useEffect, useState } from "react";
import { Tabs } from "antd";

import EditUserPage from "./EditUserPage";
import CreateUserPages from "./CreateUserPage";

import ManageProduct from "@/components/ManageProduct";
import { AppContext } from "@/context/AppContext";
import EmptyCard from "@/components/EmptyCard";

function Manage() {
  const [products, setProducts] = useState(null);
  const { token, user } = useContext(AppContext);

  const { data, error, loading, refetch } = useFetchProduct("product/all/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!loading || !error) setProducts(data);
  }, [data, loading, error]);

  const items = [
    {
      key: "1",
      label: "Product",
      children: <ManageProduct data={products} refetch={refetch}></ManageProduct>,
    },
    {
      key: "2",
      label: "Edit User",
      children: (
        <>
          {user.role === "admin" ? (
            <EditUserPage />
          ) : (
            <EmptyCard description={"This tab is for admin only"} showBtn={false} />
          )}
        </>
      ),
    },
    {
      key: "3",
      label: "Create User",
      children: (
        <>
          {user.role === "admin" ? (
            <CreateUserPages />
          ) : (
            <EmptyCard description={"This tab is for admin only"} showBtn={false} />
          )}
        </>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "0 1rem",
        margin: "2rem auto",
        backgroundColor: "rgba(255,255,255,0.2)",
        minWidth: "80vw",
      }}
    >
      <h1>Manage</h1>
      <Tabs type="card" defaultActiveKey="1" items={items} size="large" centered />
    </div>
  );
}

export default Manage;
