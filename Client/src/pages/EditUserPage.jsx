import React, { useEffect, useState, useContext } from "react";
import { Spin } from "antd";
import { NewEditUser as EditUser } from "@/components/NewEditUser"; // Named import from your component
import { AppContext } from "@/context/AppContext";
import { urlMaker ,fetchPost, optionMaker} from "../api";
import { useFetchProduct } from "@/hook/useFetchProduct";
// import { fetchPost } from "../api";

const EditUserPage = () => {
  const [users, setUsers] = useState([]);
  
  const { token } = useContext(AppContext);
  const { data, error, loading, refetch } = useFetchProduct("user", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

//   const handleUpdate = async (userid, newName) => {
//   try {
//     const options = optionMaker({ userid, name: newName }, "PATCH", token);
//     const resData = await fetchPost("user/usermanage", options);

//     if (resData.status === "success") {
//       setUsers(prevUsers =>
//         prevUsers.map(user =>
//           user.userid === userid ? { ...user, name: newName } : user
//         )
//       );
//     } else {
//       console.error("Update failed:", resData.message);
//     }
//   } catch (error) {
//     console.error("Error updating user:", error);
//   }
// };


  // const handleUpdate = async ()=>{

  //   const option = optionMaker(users, "PATCH", token);
  //   const resData = await fetchPost("user/usermanage", option);

  //   if()
  // }

  // useEffect(() => {
    
  //   console.log("Decoded Token:", atob(token.split('.')[1]));
  //   console.log("Stored Token:", token);

  //   fetch(urlMaker("user"), {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((res) => {
  //       if (!res.ok) { 
  //         throw new Error(`HTTP error! status: ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       if (data.status === "success") {
  //         setUsers(data.data);
  //       } else {
  //         console.error("API Error:", data.message);
  //       }
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching users:", error);
  //       setLoading(false);
  //     });
  // }, [token]);

  // if (loading) {
  //   return <Spin tip="Loading users..." />;
  // }
  useEffect(() => {
    if (!loading && !error) {
      setUsers(data);
    }
  }, [data, loading, error]);


  if (error) {
    return <div>Error fetching users: {error.message}</div>;
  }

  // const handleUpdate = (email, newName) => {
  //   fetch(urlMaker(`user/email/${email}`), {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ name: newName }),
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.status === "success") {
  //         setUsers(prevUsers =>
  //           prevUsers.map(user =>
  //             user.email === email ? { ...user, name: newName } : user
  //           )
  //         );
  //       } else {
  //         console.error("Update failed:", data.message);
  //       }
  //     })
  //     .catch(error => console.error("Error updating user:", error));
  // };
  

  return (
    <div >
      <h1>Edit User</h1>
      <EditUser data={users} refetch={refetch} />
    </div>
  );
};



export default EditUserPage;
