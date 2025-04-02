import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./main";
import { Toaster } from "react-hot-toast";
import "./index.css";
import "./App.css";

import Layout from "./components/Layout";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Logout from "./pages/Logout";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
// import Test from "./pages/Test";

function App() {
  const { loggedIn } = useContext(AuthContext);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            {/* <Route path="/test" element={<Test />} /> */}

            {!loggedIn && <Route path="/login" element={<Login />} />}
            {!loggedIn && <Route path="/register" element={<Signup />} />}

            {loggedIn && <Route path="/welcome" element={<Welcome />} />}
            {loggedIn && <Route path="/main" element={<MainPage />} />}
            {loggedIn && <Route path="/logout" element={<Logout />} />}
            {loggedIn && <Route path="/profile" element={<Profile />} />}

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position="top-center" gutter={12} containerStyle={{ margin: "1rem" }} />
    </>
  );
}

export default App;
