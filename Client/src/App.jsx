import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import "./index.css";
import "./App.css";
import { managers } from "./utils/const";

import Layout from "./components/Layout";
import ProductPage from "./pages/MainPage";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Logout from "./pages/Logout";
import Welcome from "./pages/Welcome";
import Registration from "./pages/Registration";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductPage";
import Manage from "./pages/Manage";
import ViewProfile from "./pages/ViewProfile";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  const { loggedIn, user } = useContext(AppContext);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/products/:productid" element={<ProductDetails />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />

            {!loggedIn && <Route path="/login" element={<Login />} />}
            {!loggedIn && <Route path="/register" element={<Registration />} />}

            {loggedIn && <Route path="/profile" element={<Profile />} />}
            {loggedIn && <Route path="/view-profile" element={<ViewProfile />} />}
            {loggedIn && managers.includes(user.role) && (
              <Route path="/manage" element={<Manage />} />
            )}
            <Route path="*" element={<NotFound />} />
          </Route>

          {loggedIn && <Route path="/welcome" element={<Welcome />} />}
          {loggedIn && <Route path="/logout" element={<Logout />} />}
        </Routes>
      </BrowserRouter>

      <Toaster position="top-center" gutter={12} containerStyle={{ margin: "1rem" }} />
    </>
  );
}

export default App;
