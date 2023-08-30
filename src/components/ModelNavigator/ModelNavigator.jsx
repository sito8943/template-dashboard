import { useMemo } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

function ModelNavigator({ collection }) {
  const { languageState } = useLanguage();

  const { buttons } = useMemo(() => {
    return { buttons: languageState.texts.buttons };
  }, [languageState]);

  return (
    <nav className="flex gap-2 mt-5">
      <Link
        to={`/${collection}/`}
        className={`small-button ${
          location.pathname === `/${collection}/` ||
          location.pathname === `/${collection}`
            ? "primary"
            : "secondary"
        }`}
      >
        {buttons.list}
      </Link>
      {collection !== "events" &&
      collection !== "projects" &&
      collection !== "mipymes" ? (
        <Link
          to={`/${collection}/insert`}
          className={`small-button ${
            location.pathname === `/${collection}/insert`
              ? "primary"
              : "secondary"
          }`}
        >
          {buttons.insert}
        </Link>
      ) : null}
    </nav>
  );
}

ModelNavigator.propTypes = {
  collection: PropTypes.string.isRequired,
};

export default ModelNavigator;
