import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ props }) => {
  return (
    <>
      <Header {...props} />
      <div className="container">
        <div className="main">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
