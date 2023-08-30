import { useState, useCallback } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faBell,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faBell as faEmptyBell } from "@fortawesome/free-regular-svg-icons";

// contexts
import { useUser } from "../../contexts/UserProvider";
import { useMode } from "../../contexts/ModeProvider";
import { useLanguage } from "../../contexts/LanguageProvider";

// components
import LazyImage from "../LazyImage/LazyImage";

// utils
import { utilsToggleTheme } from "../../utils/utils.js";
import { getUserPhoto, getUserName } from "../../utils/auth";

// styles
import styles from "./styles.module.css";

function Navbar() {
  const { userState } = useUser();
  const { languageState } = useLanguage();
  const { modeState, setModeState } = useMode();

  const printLinks = useCallback(() => {
    return languageState.texts.nav.links.map((link) => (
      <Link to={link.to} key={link.to}>
        {link.label}
      </Link>
    ));
  }, [languageState]);

  const toggleTheme = useCallback(() => {
    utilsToggleTheme();
    setModeState({ type: "toggle" });
  }, [setModeState]);

  const [notifications, setNotifications] = useState([]);
  const openNotifications = () => {};

  return (
    <header className="px-2 py-2 flex items-center justify-between">
      <Link className={`${styles.navbarTitle}`} to="/">
        <h2 className="mt-[5px]">Template Dashboard</h2>
      </Link>
      <nav>{printLinks()}</nav>
      <div className="flex gap2 items-center">
        {userState.user ? (
          <Link to="/settings/">
            <LazyImage className="w-8 h-8 mr-2 object-cover rounded-full" src={getUserPhoto()} alt={getUserName()} />
          </Link>
        ) : null}
        <button
          name="notifications"
          className="icon-button"
          onClick={openNotifications}
          aria-label={languageState.texts.ariaLabels.notifications}
        >
          <FontAwesomeIcon icon={notifications.length ? faBell : faEmptyBell} />
        </button>
        <button
          name="toggle-theme"
          onClick={toggleTheme}
          className="icon-button"
          aria-label={languageState.texts.ariaLabels.toggleTheme}
        >
          <FontAwesomeIcon icon={!modeState ? faSun : faMoon} />
        </button>
        <Link
          to="/sign-out"
          name="sign-out"
          className="icon-button"
          aria-label={languageState.texts.ariaLabels.signOut}
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
