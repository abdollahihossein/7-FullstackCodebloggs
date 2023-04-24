import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Main from "./components/Main";
import HomePage from "./components/Home";
import AdminPage from "./components/Admin";
import BloggsPage from "./components/Bloggs";
import ContentPage from "./components/Admin/Content";
import NetworkPage from "./components/Network";
import UserTable from "./components/Admin/User";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

function App() {
  let user;
  if (localStorage.length !== 0) {
    user = true;
  } else {
    user = false;
  }

  return (
    <div>
      {user && <Header />}
      <Routes>
        <Route
          path="/"
          element={user ? <Main /> : <Navigate replace to="/login" />}
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/bloggs" element={<BloggsPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/admin-content" element={<ContentPage />} />
          <Route path="/admin-user" element={<UserTable />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
