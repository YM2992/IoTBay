import { Route, Routes, BrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
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
          <Route path="/main" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
