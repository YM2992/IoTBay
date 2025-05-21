import { useFetch } from "@/hook/useFetch";
import { useContext, useEffect, useState } from "react";
import { Tabs } from "antd";

import EditUserPage from "./EditUserPage";
import CreateUserPages from "./CreateUserPage";

import ManageProduct from "@/components/ManageProduct";
import { AppContext } from "@/context/AppContext";
import EmptyCard from "@/components/EmptyCard";
import ViewSuppliers from "@/components/ViewSuppliers";
import CreateSupplier from "./CreateSupplier";

function Manage() {
  const [products, setProducts] = useState(null);
  const [users, setUsers] = useState(null);
  const { token, user } = useContext(AppContext);

  const {
    data: productData,
    error: productError,
    loading: productLoading,
    refetch: refetchProduct,
  } = useFetch("product/all/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const {
    data: userData,
    error: userError,
    loading: userLoading,
    refetch: userRefetch,
  } = useFetch("user", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!productLoading || !productError) setProducts(productData);
  }, [productData, productLoading, productError]);

  useEffect(() => {
    if (!userLoading || !userError) setUsers(userData);
  }, [userData, userLoading, userError]);

  const items = [
    {
      key: "1",
      label: "Product",
      children: <ManageProduct data={products} refetch={refetchProduct}></ManageProduct>,
    },
    {
      key: "2",
      label: "Edit User",
      children: (
        <>
          {user.role === "admin" && users ? (
            <EditUserPage users={users} refetch={userRefetch} />
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
            <CreateUserPages refetch={userRefetch} />
          ) : (
            <EmptyCard description={"This tab is for admin only"} showBtn={false} />
          )}
        </>
      ),
    },
    { // Manage Suppliers
      key: "4",
      label: "Edit Suppliers",
      children: (        
        <>
          console.log("+ filters")
          {user.role === "admin" && users ? (
            <ViewSuppliers users={users} refetch={userRefetch} />
          ) : (
            <EmptyCard description={"This tab is for admin only"} showBtn={false} />
          )}
        </>
        
      ),     
    },
    {
      key:"5",
      label: "Add Supplier",
      children: (        
        <>
          console.log("contact,company,email,address")
          {user.role === "admin" ? (
            <CreateSupplier refetch={userRefetch} />
          ) : (
            <EmptyCard description={"This tab is for admin only"} showBtn={false} />
          )}
        </>
      ),
    }
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
