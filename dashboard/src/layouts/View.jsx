import { useState, useEffect } from "react";

import { Outlet } from "react-router-dom";

// components
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

function View() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      setEntered(true);
      document.body.style.overflow = "auto";
    }, [500]);
  }, []);

  return (
    <div
      className={`entrance ${entered ? "overflow-auto" : "overflow-hidden"}`}
    >
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
