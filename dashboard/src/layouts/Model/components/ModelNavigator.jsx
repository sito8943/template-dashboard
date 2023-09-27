import { useMemo } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";

function ModelNavigator({ collection }) {
  const { languageState } = useLanguage();

  const { buttons } = useMemo(() => {
    return { buttons: languageState.texts.buttons };
  }, [languageState]);

  return (
    <nav className="flex gap-2 mt-5">
      <Link
        to={`/${collection}/`}
        className={`small-button primary ${
          location.pathname === `/${collection}/` ||
          location.pathname === `/${collection}`
            ? "submit"
            : "outlined"
        }`}
      >
        {buttons.list}
      </Link>
      <Link
        to={`/${collection}/insert`}
        className={`small-button primary ${
          location.pathname === `/${collection}/insert` ? "submit" : "outlined"
        }`}
      >
        {buttons.insert}
      </Link>
    </nav>
  );
}

ModelNavigator.propTypes = {
  collection: PropTypes.string.isRequired,
};

export default ModelNavigator;
