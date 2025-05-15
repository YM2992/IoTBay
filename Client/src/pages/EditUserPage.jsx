import { NewEditUser as EditUser } from "@/components/NewEditUser"; // Named import from your component

const EditUserPage = ({ users, refetch }) => {
  return (
    <div>
      <h1>Edit User</h1>
      <EditUser data={users} refetch={refetch} />
    </div>
  );
};

export default EditUserPage;
