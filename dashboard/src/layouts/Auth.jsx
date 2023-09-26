import { useEffect, useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

// contexts
import { useUser } from "../contexts/UserProvider";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useMode } from "../contexts/ModeProvider";
import { useLanguage } from "../contexts/LanguageProvider";

// utils
import { utilsToggleTheme } from "../utils/utils.js";

function Auth() {
  const navigate = useNavigate();

  const { userState } = useUser();

  useEffect(() => {
    if (userState.user) navigate("/");
  }, [userState]);

  const { modeState, toggleModeState } = useMode();

  const { languageState } = useLanguage();

  const toggleTheme = useCallback(() => {
    utilsToggleTheme();
    toggleModeState();
  }, [toggleModeState]);

  return (
    <div className="min-h-screen dark:bg-dark-background2 bg-light-background2 flex flex-col items-center justify-between">
      <header className="navbar w-full h-20 flex items-center justify-between">
        <Link
          to="/"
          className="flex"
          name="home-link"
          aria-label={languageState.texts.ariaLabels.homeLink}
        >
          <h2>Template Dashboard</h2>
        </Link>
        <button
          name="toggle-theme"
          onClick={toggleTheme}
          className="icon-button"
          aria-label={languageState.texts.ariaLabels.toggleTheme}
        >
          <FontAwesomeIcon icon={!modeState ? faSun : faMoon} />
        </button>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="flex items-center justify-center w-full">
        <span className="dark:text-white">
          Template Dashboard {new Date().getFullYear()} &#169;
        </span>
      </footer>
    </div>
  );
}

export default Auth;
