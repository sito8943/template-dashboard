import { useEffect, useState, useMemo, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import Tippy from "@tippyjs/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

// services
import { fetch } from "../../services/texts";

// contexts
import { useMode } from "../../contexts/ModeProvider";
import { useLanguage } from "../../contexts/LanguageProvider";
import { useNotification } from "../../contexts/NotificationProvider";

// components
import Loading from "../../components/Loading/Loading";

// utils
import { utilsToggleTheme } from "../../utils/utils.js";

// styles
import "./styles.css";

function Printer({ text, contentHTML }) {
  const [content, setContent] = useState(undefined);

  const [loading, setLoading] = useState(true);

  const { languageState } = useLanguage();

  const { tooltips, appName, errors } = useMemo(() => {
    return {
      tooltips: languageState.texts.tooltips,
      appName: languageState.texts.appName,
      errors: languageState.texts.errors,
    };
  }, [languageState]);

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const { modeState, setModeState } = useMode();

  const toggleTheme = () => {
    utilsToggleTheme();
    setModeState({ type: "toggle" });
  };

  const init = async () => {
    setLoading(true);
    try {
      const response = await fetch(text);
      const { data } = response;
      const { content } = data;
      setContent(content);
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, [text]);

  return (
    <main className="printer flex flex-col gap-5">
      {loading ? (
        <Loading className="fixed top-0 left-0 h-full w-full" />
      ) : (
        <Fragment>
          <Link to="/">
            <button
              id="go-back"
              name="home-link"
              aria-label={languageState.texts.ariaLabels.homeLink}
              className="fixed top-5 left-1 dark:text-white text-dark-background2 secondary-hover w-icon h-icon rounded-circle transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          </Link>
          <Tippy content={tooltips.changeMode}>
            <button
              name="toggle-theme"
              onClick={toggleTheme}
              aria-label={languageState.texts.ariaLabels.toggleTheme}
              className="fixed top-5 right-1 dark:text-white text-dark-background2 secondary-hover w-icon h-icon rounded-circle transition"
            >
              <FontAwesomeIcon icon={!modeState ? faMoon : faSun} />
            </button>
          </Tippy>
        </Fragment>
      )}
      {content || contentHTML ? (
        <div>
          <h1 className="text-dark-background2 dark:text-light-background2 text-4xl mt-5">
            {appName}
          </h1>
          {parse(content || contentHTML)}
        </div>
      ) : null}
    </main>
  );
}

Printer.propTypes = {
  text: PropTypes.string,
};

export default Printer;
