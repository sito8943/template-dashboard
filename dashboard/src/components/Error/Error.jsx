import { useMemo } from "react";
import PropTypes from "prop-types";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

const Error = (props) => {
  const { onRetry, text } = props;
  const { languageState } = useLanguage();

  const error = useMemo(() => {
    return languageState.texts.error;
  }, [languageState]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-10">
      <h3 className="font-bold text-error text-2xl">
        <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />
        {error.title}
      </h3>
      <p className="text-error perror">{text}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="submit"
          name={error.retry}
          aria-label={languageState.texts.ariaLabels.retry}
        >
          {error.retry}
        </button>
      ) : null}
    </div>
  );
};

Error.propTypes = {
  onRetry: PropTypes.func,
  text: PropTypes.string,
};

export default Error;
