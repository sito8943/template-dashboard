import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// styles
import styles from "./tab.module.css";

function Tab({ onClick, value, active }) {
  const { languageState } = useLanguage();

  return (
    <button
      type="button"
      name="table-tab"
      aria-label={`${languageState.texts.ariaLabels.tableTab} ${value.label}`}
      onClick={() => onClick(value.label)}
      className={`${styles.buttonTab} ${css({
        background: value.color,
      })}`}
    >
      <span className={`${styles.label}`}>{value.label}</span>
      <div
        className={`${styles.background} ${
          active === value.label ? "!h-[0%]" : ""
        }`}
      />
    </button>
  );
}

Tab.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.string,
  value: PropTypes.shape({
    label: PropTypes.string,
    color: PropTypes.string,
    query: PropTypes.shape({
      attribute: PropTypes.string,
      operator: PropTypes.string,
      value: PropTypes.any,
    }),
  }),
};

export default Tab;
