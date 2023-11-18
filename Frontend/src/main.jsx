import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./app.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/oauth" element={<Login />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  </BrowserRouter>,
);
