import { useCallback } from "react";
import { Link, Outlet } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useMode } from "../contexts/ModeProvider";

// utils
import { utilsToggleTheme } from "../utils/utils.js";

function Auth() {
  const { modeState, toggleModeState } = useMode();

  const toggleTheme = useCallback(() => {
    utilsToggleTheme();
    toggleModeState();
  }, [toggleModeState]);

  return (
    <section className="min-h-screen dark:bg-dark-background2 bg-light-background2 flex flex-col items-center justify-between">
      <header className="navbar w-full h-20 flex items-center justify-between">
        <Link to="/" className="flex">
          <h2>Mypmatch</h2>
        </Link>
        <button onClick={toggleTheme} className="icon-button">
          <FontAwesomeIcon icon={!modeState ? faSun : faMoon} />
        </button>
      </header>

      <Outlet />
      <footer className="flex items-center justify-center w-full">
        <span className="dark:text-white">
          Mypmatch {new Date().getFullYear()} &#169;
        </span>
      </footer>
    </section>
  );
}

export default Auth;
