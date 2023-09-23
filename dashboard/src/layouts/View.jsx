import { useState, useEffect } from "react";

import { Outlet } from "react-router-dom";

// components
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

function View() {
  return (
    <div>
      <Navbar />
      <div className="main">
        <Sidebar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default View;
