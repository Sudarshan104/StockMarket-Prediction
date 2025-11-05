import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Orders from "./components/Orders";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      
         <Route path="/login" element={<Login/>} />
        <Route path="/*" element={<Home />} />
       
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
