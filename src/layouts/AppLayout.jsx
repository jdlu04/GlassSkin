import NavBar from "@/Components/NavBar/NavBar";
import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <NavBar />
      <div className="container min-h-screen min-w-full mx-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout