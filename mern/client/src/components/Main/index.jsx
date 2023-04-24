import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Navbar";

const Main = () => {
  return (
    <div>
      {" "}
      <div
        style={{
          padding: "50px 0px 0px 370px",
        }}
      >
        <Sidebar />
      </div>
      <Outlet />
    </div>
  );
};

export default Main;
