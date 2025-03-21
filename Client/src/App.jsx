import { Route, Routes, BrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import MainMenu from "./pages/MainMenu";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<MainMenu />} />
          <Route path="/main" element={<MainMenu />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
