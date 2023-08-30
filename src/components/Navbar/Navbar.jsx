import { useCallback } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

// contexts
import { useMode } from "../../contexts/ModeProvider";
import { useLanguage } from "../../contexts/LanguageProvider";

// utils
import { utilsToggleTheme } from "../../utils/utils.js";

// styles
import styles from "./styles.module.css";

function Navbar() {
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

  return (
    <header className="px-2 py-2 flex items-center justify-between">
      <Link className={`${styles.navbarTitle}`} to="/">
        <h2 className="mt-[5px]">Mypmatch</h2>
      </Link>
      <nav>{printLinks()}</nav>
      <div className="flex gap2 items-center">
        <button onClick={toggleTheme} className="icon-button">
          <FontAwesomeIcon icon={!modeState ? faSun : faMoon} />
        </button>
        <Link to="/sign-out" className="icon-button">
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
