import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import "./App.css";
import "./index.css";
import Logout from "./pages/Logout";
import Welcome from "./pages/Welcome";
import Registration from "./pages/Registration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />

          {/* Conditional rendering if user is authenticated */}
          <Route
            path="/login"
            element={
              localStorage.getItem("jwt") ? (
                // logged in, show welcome page
                (() => {
                  return <Navigate to="/welcome" replace />;
                })()
              ) : (
                // not logged in, allow login
                <Login />
              )
            }
          />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/welcome"
            element={
              localStorage.getItem("jwt") ? (
                <Welcome />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/main"
            element={
              localStorage.getItem("jwt") ? (
                <MainPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
