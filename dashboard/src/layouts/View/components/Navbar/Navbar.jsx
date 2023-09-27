import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import loadable from "@loadable/component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faBell,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faBell as faEmptyBell } from "@fortawesome/free-regular-svg-icons";

// contexts
import { useUser } from "../../../../contexts/UserProvider";
import { useMode } from "../../../../contexts/ModeProvider";
import { useLanguage } from "../../../../contexts/LanguageProvider";

// components
import Badge from "../../../../components/Badge/Badge";
import LazyImage from "../../../../components/LazyImage/LazyImage";

// services
import { fetchNotifications } from "../../../../services/users";

// utils
import { utilsToggleTheme } from "../../../../utils/utils.js";
import { getUserPhoto, getUserName } from "../../../../utils/auth";

// styles
import styles from "./styles.module.css";

// lazy
const Notifications = loadable(() => import("./Notifications/Notifications"));

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

  const localFetchNotifications = useCallback(async () => {
    try {
      const remoteNotifications = await fetchNotifications();
      const { list } = await remoteNotifications.data;
    } catch (err) {
      console.error(err);
    }
  }, []);

  const [showNotifications, setShowNotifications] = useState(false);

  const openNotifications = () => setShowNotifications(true);
  const hideNotifications = useCallback(() => setShowNotifications(false), []);

  useEffect(() => {
    if (showNotifications)
      setTimeout(() => {
        window.addEventListener("click", hideNotifications);
      }, 200);
    else window.removeEventListener("click", hideNotifications);
  }, [showNotifications]);

  useEffect(() => {
    if (userState.user) localFetchNotifications();
  }, [userState.user]);

  return (
    <header className="px-2 py-2 flex items-center justify-between">
      <Link className="text-4xl md:text-2xl" to="/">
        <h2>{languageState.texts.navbarTitle}</h2>
      </Link>
      <nav>{printLinks()}</nav>
      <div className="flex gap2 items-center">
        {userState.user ? (
          <Link to="/settings/">
            <LazyImage
              className="w-8 h-8 mr-2 object-cover rounded-full"
              src={getUserPhoto()}
              alt={getUserName()}
            />
          </Link>
        ) : null}
        <button
          onClick={openNotifications}
          name="notifications"
          className="icon-button relative"
          aria-label={languageState.texts.ariaLabels.notifications}
        >
          {notifications.length ? <Badge /> : null}
          <FontAwesomeIcon icon={notifications.length ? faBell : faEmptyBell} />
        </button>
        <Notifications
          show={showNotifications}
          notifications={notifications}
          onClose={hideNotifications}
        />
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
