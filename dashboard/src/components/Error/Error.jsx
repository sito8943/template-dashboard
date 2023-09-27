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

  const { buttons, errors, ariaLabels } = useMemo(
    () => languageState.texts,
    [languageState]
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 min-h-[300px]">
      <h3 className="font-bold error text-2xl">
        <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />
        {errors.wrong}
      </h3>
      <p className="error">{text}</p>
      {onRetry ? (
        <button
          name="reload"
          onClick={onRetry}
          className="primary submit"
          aria-label={ariaLabels.retry}
        >
          {buttons.reload}
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
