import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import "./App.css";
import "./index.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />

          {/* Conditional rendering if user is authenticated */}
          <Route path="/login"
            element={
              localStorage.getItem("token") ? (
                // logged in, show welcome page
                (() => {
                  return <Navigate to="/welcome" replace />
                })()
              ) : (
                // not logged in, allow login
                <Login />
              )
            }
          />
          <Route path="/main"
            element={
              localStorage.getItem("token") ? <MainPage /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/logout"
            element={
              localStorage.getItem("token") ? (
                // logged in, clear user session and redirect to landing
                (() => {
                  localStorage.clear();
                  return <Navigate to="/landing" replace />;
                  // return <Logout />;
                })()
              ) : (
                // not logged in, redirect to landing
                <Navigate to="/" replace />
              )
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
